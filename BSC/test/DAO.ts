import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";
import { DAO } from "../typechain-types";

describe("DAO", function () {

    const ABI = ["function increment(uint256 num)"];
    const iface = new ethers.utils.Interface(ABI);
    const txData = iface.encodeFunctionData("increment", [5]);
    const period: BigNumber = BigNumber.from(259200); // 3 days
    const zero: BigNumber = BigNumber.from("0");
    const minumumUserTokens: BigNumber = ethers.utils.parseEther("1000");
    const proposalDescription: string = "Some description";

    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deployDAOFixture() {

        // Contracts are deployed using the first signer/account by default
        const [owner] = await ethers.getSigners();
        const signers: SignerWithAddress[] = await ethers.getSigners();

        const DAO = await ethers.getContractFactory("DAO");
        const BOT = await ethers.getContractFactory("BotTokenV2");

        const bot = await BOT.deploy();

        const voteToken: string = bot.address;
        const minimumQuorum: BigNumber = ethers.utils.parseEther("51");
        const debatingPeriodDuration: BigNumber = period; // 3 days
        const minimumVotes: BigNumber = ethers.utils.parseEther("1000");
        const dao = await DAO.deploy(voteToken, minimumQuorum, debatingPeriodDuration, minimumVotes);

        const user: SignerWithAddress = signers[1];

        return { bot, dao, owner, user, signers, minimumQuorum, debatingPeriodDuration, minimumVotes };
    }

    describe("Constructor", function () {
        it("1. Test getToken", async () => {
            const { bot, dao } = await loadFixture(deployDAOFixture);

            expect(await dao.getToken()).to.eq(bot.address);
        });

        it("2. Test getMinQuorum", async () => {
            const { dao, minimumQuorum } = await loadFixture(deployDAOFixture);

            expect(await dao.getMinQuorum()).to.eq(minimumQuorum);
        });

        it("3. Test getDebatePeriod", async () => {
            const { dao, debatingPeriodDuration } = await loadFixture(deployDAOFixture);

            expect(await dao.getDebatePeriod()).to.eq(debatingPeriodDuration);
        });

        it("4. Test getMinVotes", async () => {
            const { dao, minimumVotes } = await loadFixture(deployDAOFixture);

            expect(await dao.getMinVotes()).to.eq(minimumVotes);
        });

        it("5. Test balances", async () => {
            const { dao, signers } = await loadFixture(deployDAOFixture);

            expect(await dao.getUserBalance(signers[0].address)).to.eq(0);
        });
    });

    describe("Contract owner", function () {
        it("1. Test withdrawETH (reverts, event ETHWithdrawn)", async function () {
            const { bot, dao, user, owner } = await loadFixture(deployDAOFixture);

            // Ownable: caller is not the owner
            const amount: BigNumber = ethers.utils.parseEther("3");
            await expect(dao.connect(user).withdrawETH(owner.address, amount))
                .to.be.revertedWith("Ownable: caller is not the owner");

            // Address: insufficient balance
            await expect(dao.withdrawETH(owner.address, amount))
                .to.be.revertedWith("Address: insufficient balance");

            // Event ETHWithdrawn
            await network.provider.send("hardhat_setBalance", [
                dao.address,
                ethers.utils.parseEther("5").toHexString()
            ]);
            const balanceETHofDAOResult = await dao.provider.getBalance(dao.address);
            const balanceETHofDAOExpected = ethers.utils.parseEther("5");
            expect(balanceETHofDAOExpected).to.equal(balanceETHofDAOResult);
            
            await expect(dao.withdrawETH(owner.address, amount))
                .to.emit(dao, "ETHWithdrawn")
                .withArgs(owner.address, amount);
        });
    });

    describe("Proposal owner", function () {
        it("1. Test addProposal (event ProposalAdded, onlyOwner, getProposalById)", async function () {
            // ARRANGE
            const { bot, dao, signers } = await loadFixture(deployDAOFixture);

            // ACT
            await expect(dao.connect(signers[1]).addProposal(bot.address, txData, proposalDescription, minumumUserTokens))
                .to.be.revertedWith("Ownable: caller is not the owner");

            await expect(dao.addProposal(bot.address, txData, proposalDescription, minumumUserTokens))
                .to.emit(dao, "ProposalAdded");

            const time = (
                await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
            ).timestamp;

            const result = await dao.getProposalById(0);
            const lastProposalIdResult = await dao.getLastProposalId();
            const lastProposalIdExpected = 1;

            // ASSERT
            expect(result[0]).to.eq(bot.address);
            expect(result[1]).to.eq(txData);
            expect(result[2]).to.eq(proposalDescription);
            expect(result[3]).to.eq(false);
            expect(result[4]).to.eq(period.add(time));
            expect(result[5]).to.eq(zero);
            expect(result[6]).to.eq(zero);
            expect(result[7]).to.eq(zero);
            expect(result[8]).to.eq(minumumUserTokens);

            expect(lastProposalIdExpected).to.equal(lastProposalIdResult);
        });

        it("2. Test endProposal (reverts, Event FinishedEmergency)", async function () {
            // ARRANGE
            const { bot, dao, user, signers } = await loadFixture(deployDAOFixture);
            const proposalId = BigNumber.from(0);

            // ACT
            await dao.addProposal(bot.address, txData, proposalDescription, minumumUserTokens);

            // DAO: Voting time is not over yet
            await expect(
                dao.endProposal(proposalId)
            ).to.be.revertedWith("DAO: Voting time is not over yet");

            await time.increase(period);

            // Ownable: caller is not the owner
            await expect(
                dao.connect(user).endProposal(proposalId)
            ).to.be.revertedWith("Ownable: caller is not the owner");

            // Event FinishedEmergency
            await expect(dao.endProposal(proposalId))
                .to.emit(dao, "FinishedEmergency")
                .withArgs(proposalId);

            // DAO: Voting has already ended
            await expect(
                dao.endProposal(proposalId)
            ).to.be.revertedWith("DAO: Voting has already ended");
        });
    });

    describe("Owner management", function () {
        it("1. Test transferOwnership from current to account1", async function () {
            // ARRANGE
            const { bot, user } = await loadFixture(deployDAOFixture);

            // ACT
            await bot.transferOwnership(user.address);
            const ownerResult: string = await bot.owner();
            const ownerExpected: string = user.address;

            // ASSERT
            expect(ownerExpected).to.equal(ownerResult);
        });

        it("2. Test renounceOwnership", async function () {
            // ARRANGE
            const { bot } = await loadFixture(deployDAOFixture);

            // ACT
            await bot.renounceOwnership();
            const ownerResult: string = await bot.owner();
            const ownerExpected: string = "0x0000000000000000000000000000000000000000";

            // ASSERT
            expect(ownerExpected).to.equal(ownerResult);
        });
    });

    describe("Proposal user", function () {
        it("1. Test deposit (revert DAO: Amount is 0, event Credited, getUserBalance, getActiveUsers)", async function () {
            const { bot, owner, dao, user } = await loadFixture(deployDAOFixture);

            const amount: BigNumber = BigNumber.from(100);

            await bot.connect(owner).transfer(user.address, amount);
            await bot.connect(user).approve(dao.address, amount);
            const usersBefore: BigNumber = await dao.getActiveUsers();

            // Check 0 amount
            await expect(
                dao.connect(user).deposit(0)
            ).to.be.revertedWith("DAO: Amount is 0");

            // Deposit and check event
            await expect(dao.connect(user).deposit(amount))
                .to.emit(dao, "Credited")
                .withArgs(user.address, amount);

            // Check balance
            const balanceExpected = amount;
            const balanceResult = await dao.getUserBalance(user.address);
            expect(balanceExpected).to.eq(balanceResult);

            // Check incremented activeUsers
            const usersReult: BigNumber = await dao.getActiveUsers();
            const usersExpected: BigNumber = usersBefore.add(1);
            expect(usersExpected).to.eq(usersReult);
        });

        it("2. Test vote (reverts, event Voted)", async function () {
            const { bot, dao, user } = await loadFixture(deployDAOFixture);

            await dao.addProposal(bot.address, txData, proposalDescription, minumumUserTokens);
            const proposalId: BigNumber = BigNumber.from(0);

            // DAO: No tokens on balance
            const answer: boolean = true;
            await expect(dao.connect(user).vote(proposalId, answer))
                .to.be.revertedWith("DAO: No tokens on balance");

            // DAO: Need more tokens to vote
            const amount: BigNumber = minumumUserTokens.div(2);
            await bot.transfer(user.address, minumumUserTokens);
            await bot.connect(user).approve(dao.address, minumumUserTokens);
            await dao.connect(user).deposit(amount);
            await expect(dao.connect(user).vote(proposalId, answer))
                .to.be.revertedWith("DAO: Need more tokens to vote");

            // Voted(msg.sender, proposalId_, answer_);
            await dao.connect(user).deposit(amount);
            await expect(dao.connect(user).vote(proposalId, answer))
                .to.emit(dao, "Voted")
                .withArgs(user.address, proposalId, answer);

            // DAO: You have already voted in this proposal
            await expect(dao.connect(user).vote(proposalId, answer))
                .to.be.revertedWith("DAO: You have already voted in this proposal");

            // DAO: The voting is already over or does not exist
            const endVoteTime = (await time.latest()) + period.toNumber();
            await time.setNextBlockTimestamp(endVoteTime);
            await expect(dao.connect(user).vote(proposalId, answer))
                .to.be.revertedWith("DAO: The voting is already over or does not exist");
        });

        it("3. Test vote (consentings, dissenters, isUserVoted, lastVoteEndTime, usersVoted)", async function () {
            const { bot, owner, dao, user } = await loadFixture(deployDAOFixture);

            await dao.addProposal(bot.address, txData, proposalDescription, minumumUserTokens);
            const proposalId: BigNumber = BigNumber.from(0);
            const amountVoteTrue: BigNumber = minumumUserTokens.mul(2);
            await bot.transfer(user.address, amountVoteTrue);

            // consentings
            await bot.connect(user).approve(dao.address, amountVoteTrue);
            await dao.connect(user).deposit(amountVoteTrue);
            await dao.connect(user).vote(proposalId, true);

            let proposal: DAO.ProposalStructOutput = await dao.getProposalById(proposalId);
            const concentingsBalancesResult = proposal.consenting;
            const concentingsBalancesExpected = amountVoteTrue;
            expect(concentingsBalancesExpected).to.equal(concentingsBalancesResult);

            // dissenters
            const amountVoteFalse: BigNumber = minumumUserTokens;
            await bot.connect(owner).approve(dao.address, amountVoteFalse);
            await dao.connect(owner).deposit(amountVoteFalse);
            await dao.connect(owner).vote(proposalId, false);

            proposal = await dao.getProposalById(proposalId);
            const dissentersBalancesResult: BigNumber = proposal.dissenters;
            const dissentersBalancesExpected: BigNumber = amountVoteFalse;
            expect(dissentersBalancesExpected).to.equal(dissentersBalancesResult);

            // isUserVoted
            const isUserVotedResult: boolean = await dao.isUserVoted(user.address, proposalId);
            const isUserVotedExpected: boolean = true;
            expect(isUserVotedExpected).to.equal(isUserVotedResult);

            // lastVoteEndTime
            const lastVoteEndTimeResult: BigNumber = await dao.userLastVoteEndTime(user.address);
            const lastVoteEndTimeExpected: BigNumber = proposal.endTime;
            expect(lastVoteEndTimeExpected).to.equal(lastVoteEndTimeResult);

            // usersVoted
            const usersVotedResult = proposal.usersVoted;
            const usersVotedExpected = 2;
            expect(usersVotedExpected).to.equal(usersVotedResult);
        });

        it("4. Test withdrawTokens (reverts, user balance, getActiveUsers, event TokensWithdrawn)", async function () {
            const { bot, owner, dao, user } = await loadFixture(deployDAOFixture);

            await dao.addProposal(bot.address, txData, proposalDescription, minumumUserTokens);
            await bot.approve(dao.address, minumumUserTokens);
            await dao.deposit(minumumUserTokens);
            const proposalId = 0;
            const answer = true;
            await dao.vote(proposalId, answer);

            // DAO: Insufficient funds on the balance
            await expect(dao.withdrawTokens(minumumUserTokens.mul(2)))
                .to.be.revertedWith("DAO: Insufficient funds on the balance");

            // DAO: The last vote you participated in hasn't ended yet
            await expect(dao.withdrawTokens(minumumUserTokens))
                .to.be.revertedWith("DAO: The last vote you participated in hasn't ended yet");

            // Event TokensWithdrawn
            const userBalanceBefore = await dao.getUserBalance(owner.address);
            const activeUsersBefore = await dao.getActiveUsers();

            const proposal = await dao.getProposalById(proposalId);
            let endTime = proposal.endTime.add(1);
            await time.setNextBlockTimestamp(endTime);
            await expect(dao.withdrawTokens(minumumUserTokens))
                .to.emit(dao, "TokensWithdrawn")
                .withArgs(owner.address, minumumUserTokens);

            // Check user balance descrease
            const userBalanceAfter = await dao.getUserBalance(owner.address);
            expect(userBalanceAfter).to.lessThan(userBalanceBefore);

            // Active users decrement
            const activeUsersAfter = await dao.getActiveUsers();
            expect(activeUsersAfter).to.lessThan(activeUsersBefore);
        });
    });
});

/*
write:

+addProposal
+deposit
+endProposal
finishProposal
+renounceOwnership
+transferOwnership
+vote
withdrawETH
+withdrawTokens

read:

+getActiveUsers
+getUserBalance
+getDebatePeriod
+getLastProposalId
+getMinQuorum
+getMinVotes
+getProposalById
+getToken
+isUserVoted
+owner
+userLastVoteEndTime

*/