// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
// import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ISuperfluid, ISuperToken, ISuperApp} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {ISETH} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/tokens/ISETH.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";
import {SuperAppBaseCFA} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBaseCFA.sol";

// Tasks
// - Add all the creators
// - Allow accepting streams and control streams
// - Distribute these streams to the creator , according to the stats
// - A Stream will be started whenever a new flow is created , we will just update the Flow to the users
// - Can be based on the number of Views and Watch hours for the creator
contract AtlasRouter is SuperAppBaseCFA {
    using SuperTokenV1Library for ISuperToken;
    ISuperToken public acceptedSuperToken;

    int96 public totalInflowRate;

    constructor(
        ISuperToken _acceptedSuperToken,
        ISuperfluid _host
    ) SuperAppBaseCFA(_host, true, true, true) {
        acceptedSuperToken = _acceptedSuperToken;
    }

    // constructor(ISuperToken _acceptedSuperToken) {}

    ///////////  MAIN FUNCTIONS  /////////////
    function distributeSubscriptions(
        address[] memory creators,
        int96[] memory shares,
        int96 totalShares
    ) public {
        /// get the Address of the creators
        uint totalCreators = creators.length;
        for (uint256 i; i < totalCreators; ) {
            address creator = creators[i];
            int96 flowRate = (shares[i] * totalInflowRate) / totalShares;

            require(creator != address(0), "INVALID ADDRESS");

            if (flowRate == 0) {
                // delete a flow if the flow Rate == 0 , meaning the creator is either not active , or no views
                acceptedSuperToken.deleteFlow(address(this), creator);
            } else {
                /// check streams
                if (
                    acceptedSuperToken.getFlowRate(address(this), creator) == 0
                ) {
                    /// or create a new stream to the creator
                    bool success = acceptedSuperToken.createFlow(
                        creator,
                        flowRate
                    );
                    require(success, "CREATE FLOW FAILED");
                }
                // otherwise, there's already outflows which should be increased
                /// update if already present on the basis of new share
                else {
                    bool success = acceptedSuperToken.updateFlow(
                        creator,
                        flowRate
                    );
                    require(success, "UPDATE FLOW FAILED");
                }
            }

            unchecked {
                i++;
            }
        }
        /// ISSUE : The Older flow for the creators who are not yet
        /// this way the distributions is refreshed every few hours
    }

    ///////////  CALLBACK LOGIC  /////////////

    function onFlowCreated(
        ISuperToken superToken,
        address sender,
        bytes calldata ctx
    ) internal override returns (bytes memory newCtx) {
        newCtx = ctx;

        // get inflow rate from sender
        int96 inflowRate = superToken.getFlowRate(sender, address(this));
        totalInflowRate += inflowRate;
    }

    function onFlowUpdated(
        ISuperToken superToken,
        address sender,
        int96 previousFlowRate,
        uint256 /*lastUpdated*/,
        bytes calldata ctx
    ) internal override returns (bytes memory newCtx) {
        newCtx = ctx;

        int96 inflowChange = superToken.getFlowRate(sender, address(this)) -
            previousFlowRate;

        totalInflowRate += inflowChange;
    }

    function onFlowDeleted(
        ISuperToken superToken,
        address sender,
        address /*receiver*/,
        int96 previousFlowRate,
        uint256 /*lastUpdated*/,
        bytes calldata ctx
    ) internal override returns (bytes memory newCtx) {
        newCtx = ctx;
        // we just care about the flow to the Contract , which when deleted reduces to total inFlow

        totalInflowRate -= previousFlowRate;
    }

    /*///////////////////////////////////////////////////////////////
                           Superfluid
    //////////////////////////////////////////////////////////////*/

    function getStreamInfo(
        address superTokenAddress,
        address user
    )
        public
        view
        returns (
            uint256 timestamp,
            int96 flowRate,
            uint256 deposit,
            uint256 owedDeposit
        )
    {
        (timestamp, flowRate, deposit, owedDeposit) = ISuperToken(
            superTokenAddress
        ).getFlowInfo(user, address(this));
    }

    function getNetStreamInfo() public view returns (int96 flowRate) {
        (flowRate) = acceptedSuperToken.getNetFlowRate(address(this));
    }

    function wrapSuperTokenUser(
        address token,
        address superTokenAddress,
        uint amountToWrap
    ) external {
        // User has to approve before calling the wrapSuperToken
        // Getting tokens from the user
        IERC20(token).transferFrom(msg.sender, address(this), amountToWrap);

        // approving to transfer tokens from this to superTokenAddress
        IERC20(token).approve(superTokenAddress, amountToWrap);

        // wrapping and sent to this contract
        ISuperToken(superTokenAddress).upgrade(amountToWrap);

        // sending back the superToken to the user
        ISuperToken(superTokenAddress).transfer(msg.sender, amountToWrap);
    }

    function unwrapSuperTokenUser(
        address superTokenAddress,
        uint amountToUnwrap
    ) external {
        // sending supertoken from user to contract
        ISuperToken(superTokenAddress).transferFrom(
            msg.sender,
            address(this),
            amountToUnwrap
        );
        // unwrapping
        ISuperToken(superTokenAddress).downgrade(amountToUnwrap);

        // get token
        address underlyingToken = ISuperToken(superTokenAddress)
            .getUnderlyingToken();

        // transfer to user
        IERC20(underlyingToken).transferFrom(
            address(this),
            msg.sender,
            amountToUnwrap
        );
    }

    function wrapSuperToken(
        address token,
        address superTokenAddress,
        uint amountToWrap
    ) internal {
        // approving to transfer tokens from this to superTokenAddress
        IERC20(token).approve(superTokenAddress, amountToWrap);

        // wrapping and sent to this contract
        ISuperToken(superTokenAddress).upgrade(amountToWrap);
    }

    function unwrapSuperToken(
        address superTokenAddress,
        uint amountToUnwrap
    ) internal {
        // unwrapping
        ISuperToken(superTokenAddress).downgrade(amountToUnwrap);
    }

    function createStreamToContract(
        address token,
        address from,
        address to,
        int96 flowRate
    ) internal {
        // if (
        //     !accountList[msg.sender] ||
        //     msg.sender != owner() ||
        //     msg.sender != address(this)
        // ) revert Unauthorized();

        ISuperToken(token).createFlowFrom(from, to, flowRate);
    }

    function updateFlowToContract(
        address token,
        address from,
        address to,
        int96 flowRate
    ) internal {
        // if (
        //     !accountList[msg.sender] ||
        //     msg.sender != owner() ||
        //     msg.sender != address(this)
        // ) revert Unauthorized();

        ISuperToken(token).updateFlowFrom(from, to, flowRate);
    }

    function deleteFlowToContract(
        address token,
        address from,
        address to
    ) internal {
        // if (
        //     !accountList[msg.sender] ||
        //     msg.sender != owner() ||
        //     msg.sender != address(this)
        // ) revert Unauthorized();

        ISuperToken(token).deleteFlowFrom(from, to);
    }
}
