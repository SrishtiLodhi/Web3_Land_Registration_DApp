// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LandRecord {
    address public manager;
    mapping(uint => address) public notary_office;
    mapping(uint => address) public sro_office;
    mapping(uint => address) public land_revenue_office;

    // for singup
    mapping(address => bool) public isUserRegistered;
    mapping(address => string) private usernames;
    mapping(string => bytes32) private hashedPasswords;

    // usdc token
    address public erc20TokenAddress;

    // global variables
    uint public index;

    constructor(uint _district_id, address _add, address _erc20TokenAddress) {
        manager = msg.sender;
        erc20TokenAddress = _erc20TokenAddress;
        notary_office[_district_id] = _add;
        sro_office[_district_id] = _add;
        land_revenue_office[_district_id] = _add;
    }

    //////////// Enum ////////////
    enum land_status {
        NotForSale,
        ForSale,
        Accepted
    }

    //////////// Struct ////////////
    struct land_details {
        uint unique_id;
        string add;
        address owner;
        uint district_id;
        uint price;
        uint request_count;
        address new_owner;
        LandRecord.land_status status;
        string size;
        string name;
        string new_owner_name;
    }
    struct Request {
        uint amount;
        address requester;
        string requester_name;
    }

    //////////// modifiers ////////////

    modifier onlyManager() {
        require(msg.sender == manager, "You are not the manager");
        _;
    }

    modifier onlyRegisteredUser() {
        require(isUserRegistered[msg.sender], "User not registered");
        _;
    }

    uint[] public for_sale_properties;
    mapping(uint => land_details) public lands;
    mapping(uint => Request[]) public requests;
    mapping(address => uint[]) public profile;
    mapping(address => uint[]) public accepted_request;
    mapping(uint => address[]) public previous_owners;
    mapping(string => bool) public isUserRegisteredByUsername;
    mapping(address => string) public aadharCards;

    // onlyOnwer function

    // change manger
    function changeOwner(address _add) public onlyManager {
        manager = _add;
    }

    function add_notary(uint _district_id, address _add) public onlyManager {
        notary_office[_district_id] = _add;
    }

    function add_sro(uint _district_id, address _add) public onlyManager {
        sro_office[_district_id] = _add;
    }

    function add_land_revenue(
        uint _district_id,
        address _add
    ) public onlyManager {
        land_revenue_office[_district_id] = _add;
    }

    function create_land_record(
        string memory _name,
        uint _district_id,
        string memory _add,
        address _owner,
        string memory _size
    ) public onlyManager {
        lands[index].unique_id = index;
        lands[index].add = _add;
        lands[index].owner = _owner;
        lands[index].name = _name;
        lands[index].district_id = _district_id;
        lands[index].status = land_status.NotForSale;
        lands[index].size = _size;
        profile[_owner].push(index);
        index++;
    }

    // user sign up
    function registerUser(
        string memory _username,
        string memory _password,
        string memory _aadharcard
    ) public {
        require(!isUserRegistered[msg.sender], "User already registered");

        // Hash the password
        bytes32 hashedPassword = keccak256(abi.encodePacked(_password));

        // Store user information
        usernames[msg.sender] = _username;
        hashedPasswords[_username] = hashedPassword;
        isUserRegistered[msg.sender] = true;
        aadharCards[msg.sender] = _aadharcard;
    }

    // user login
    function login(
        string memory _username,
        string memory _password
    ) external view onlyRegisteredUser returns (bool) {
        require(
            hashedPasswords[_username] ==
                keccak256(abi.encodePacked(_password)),
            "Invalid credentials"
        );

        return true;
    }

    function isUsernameTaken(
        string memory _username
    ) public view returns (bool) {
        require(bytes(_username).length > 0, "Username cannot be empty");
        return isUserRegisteredByUsername[_username];
    }

    //////////// seller functions ////////////

    function make_land_available(
        uint _index,
        uint _price
    ) public onlyRegisteredUser {
        require(
            lands[_index].status == land_status.NotForSale,
            "You have already marked this property for sale"
        );
        require(
            lands[_index].owner == msg.sender,
            "You are not the owner of this property"
        );
        lands[_index].price = _price;
        lands[_index].status = land_status.ForSale;
        for_sale_properties.push(_index);
    }

    function accept_request(
        uint _index,
        uint _request_index
    ) public onlyRegisteredUser {
        require(lands[_index].owner == msg.sender);
        lands[_index].status = land_status.Accepted;
        lands[_index].new_owner = requests[_index][_request_index].requester;
        lands[_index].new_owner_name = requests[_index][_request_index]
            .requester_name;
        lands[_index].price = requests[_index][_request_index].amount;
        delete requests[_index];
        lands[_index].request_count = 0;
        uint sale_index = find_sale_index(_index);
        for_sale_properties[sale_index] = for_sale_properties[
            for_sale_properties.length - 1
        ];
        delete for_sale_properties[for_sale_properties.length - 1];
        for_sale_properties.pop();
        address _add = lands[_index].new_owner;
        accepted_request[_add].push(_index);
    }

    function reject_request(
        uint _index,
        uint _request_index
    ) public onlyRegisteredUser {
        require(lands[_index].owner == msg.sender);
        requests[_index][_request_index] = requests[_index][
            requests[_index].length - 1
        ];
        requests[_index].pop();
        lands[_index].request_count--;
    }

    //////////// buyer functions ////////////

    function add_request(
        string memory _name,
        uint _index,
        uint _price
    ) public onlyRegisteredUser {
        require(
            lands[_index].status == land_status.ForSale,
            "This property is not for sale"
        );
        Request memory req = Request({
            amount: _price,
            requester: msg.sender,
            requester_name: _name
        });
        lands[_index].request_count++;
        requests[_index].push(req);
    }

    function payAllFeesAndBuyProperty(uint _index) public onlyRegisteredUser {
        require(
            lands[_index].status == land_status.Accepted,
            "You cannot buy this property"
        );
        require(
            lands[_index].new_owner == msg.sender,
            "Your request has not been accepted yet"
        );

        IERC20 erc20Token = IERC20(erc20TokenAddress);
        uint fees = calculate_fees(_index);
        uint totalFees = calculate_total_cost(_index);

        // Check if the user has enough balance
        require(
            erc20Token.balanceOf(msg.sender) >= totalFees,
            "Insufficient funds"
        );

        erc20Token.transferFrom(msg.sender, address(this), totalFees);

        // Transfer all fees in one go
        erc20Token.transfer(notary_office[lands[_index].district_id], fees);
        erc20Token.transfer(sro_office[lands[_index].district_id], fees);
        erc20Token.transfer(
            land_revenue_office[lands[_index].district_id],
            fees
        );

        // Transfer property price to the current owner
        erc20Token.transfer(lands[_index].owner, lands[_index].price);

        // Update ownership and status
        remove_ownership(_index, lands[_index].owner);
        previous_owners[_index].push(lands[_index].owner);

        address temp_new_owner = address(uint160(lands[_index].new_owner));
        lands[_index].name = lands[_index].new_owner_name;
        lands[_index].owner = temp_new_owner;
        lands[_index].status = land_status.NotForSale;
        lands[_index].price = 0;
        lands[_index].new_owner = address(0);
        lands[_index].new_owner_name = "";

        // Update the buyer's profile and remove the request
        profile[lands[_index].owner].push(_index);
        remove_request(_index, lands[_index].owner);
    }

    //////////// private functions ////////////
    function remove_ownership(uint _index, address user) private {
        uint asset_index = find_asset_index(_index, user);
        profile[user][asset_index] = profile[user][profile[user].length - 1];
        delete profile[user][profile[user].length - 1];
        profile[user].pop();
    }

    function remove_request(uint _index, address user) private {
        uint request_index = find_request(_index, user);
        accepted_request[user][request_index] = accepted_request[user][
            accepted_request[user].length - 1
        ];
        delete accepted_request[user][accepted_request[user].length - 1];
        accepted_request[user].pop();
    }

    //////////// calculations ////////////
    function find_sale_index(uint _index) public view returns (uint) {
        uint i;
        for (i = 0; i < for_sale_properties.length; i++) {
            if (for_sale_properties[i] == _index) return i;
        }
        return i;
    }

    function calculate_fees(uint _index) public view returns (uint) {
        return (lands[_index].price * 10) / 100;
    }

    function calculate_total_cost(uint _index) public view returns (uint) {
        return 3 * calculate_fees(_index) + lands[_index].price;
    }

    function find_asset_index(
        uint _index,
        address user
    ) public view returns (uint) {
        uint i;
        for (i = 0; i < profile[user].length; i++) {
            if (profile[user][i] == _index) return i;
        }
        return i;
    }

    function find_request(
        uint _index,
        address user
    ) public view returns (uint) {
        uint i;
        for (i = 0; i < accepted_request[user].length; i++) {
            if (accepted_request[user][i] == _index) return i;
        }
        return i;
    }

    //////////// getter functions ////////////

    function get_Sale_properties() public view returns (uint[] memory) {
        return for_sale_properties;
    }

    function get_asset_list(address _add) public view returns (uint[] memory) {
        return profile[_add];
    }

    function get_accepted_request(
        address _add
    ) public view returns (uint[] memory) {
        return accepted_request[_add];
    }

    // function get_previous_owner(
    //     uint _index
    // ) public view returns (address[] memory) {
    //     return previous_owners[_index];
    // }

    function getPropertiesForSaleCount() public view returns (uint) {
        return for_sale_properties.length;
    }

    function getOwnedPropertiesCount(address owner) public view returns (uint) {
        return profile[owner].length;
    }

    function getPendingRequestsCount(address owner) public view returns (uint) {
        return accepted_request[owner].length;
    }

    function getAllProperties() public view returns (land_details[] memory) {
        land_details[] memory allProperties = new land_details[](index);

        for (uint i = 0; i < index; i++) {
            allProperties[i] = lands[i];
        }

        return allProperties;
    }

    function getUsername(address _user) public view returns (string memory) {
        return usernames[_user];
    }

    function getPropertyRequests(
        uint _index
    ) public view returns (Request[] memory) {
        return requests[_index];
    }
}
