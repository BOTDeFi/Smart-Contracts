import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { DAO } from "../typechain-types";

describe("DAO", function () {

    const ABI = ["function increment(uint256 num)"];
    const iface = new ethers.utils.Interface(ABI);
    const txData = iface.encodeFunctionData("increment", [5]);
    const period: BigNumber = ethers.utils.parseEther("259200"); // 3 days
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

            expect(await dao.getBalance(signers[0].address)).to.eq(0);
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
        });
    });

    describe("Proposal user", function () {
        it("1. Test deposit (revert DAO: Amount is 0, event Credited, getBalance, getActiveUsers)", async function () {
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
            const balanceResult = await dao.getBalance(user.address);
            expect(balanceExpected).to.eq(balanceResult);

            // Check incremented activeUsers
            const usersReult: BigNumber = await dao.getActiveUsers();
            const usersExpected: BigNumber = usersBefore.add(1);
            expect(usersExpected).to.eq(usersReult);
        });

        it("2. Test vote (reverts, event Voted)", async function () {
            const { bot, owner, dao, signers, user } = await loadFixture(deployDAOFixture);

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
            await time.increaseTo(period.add(period));
            await expect(dao.connect(user).vote(proposalId, answer))
                .to.be.revertedWith("DAO: The voting is already over or does not exist");
        });

        it("3. Test vote (consentings, dissenters, isUserVoted, lastVoteEndTime, usersVoted)", async function () {
            const { bot, owner, dao, signers, user } = await loadFixture(deployDAOFixture);

            await dao.addProposal(bot.address, txData, proposalDescription, minumumUserTokens);
            const proposalId: BigNumber = BigNumber.from(0);
            const amountVoteTrue: BigNumber = minumumUserTokens.mul(2);
            await bot.transfer(user.address, amountVoteTrue);

            // consentings
            await bot.connect(user).approve(dao.address, amountVoteTrue);
            await dao.connect(user).deposit(amountVoteTrue);
            await dao.connect(user).vote(proposalId, true);

            let proposal: DAO.ProposalStructOutput = await dao.getProposalById(proposalId);
            const concentingsResult = proposal.consenting;
            const concentingsExpected = amountVoteTrue;
            expect(concentingsExpected).to.equal(concentingsResult);

            // dissenters
            const amountVoteFalse: BigNumber = minumumUserTokens;
            await bot.connect(owner).approve(dao.address, amountVoteFalse);
            await dao.connect(owner).deposit(amountVoteFalse);
            await dao.connect(owner).vote(proposalId, false);

            proposal = await dao.getProposalById(proposalId);
            const dissentersResult: BigNumber = proposal.dissenters;
            const dissentersExpected: BigNumber = amountVoteFalse;
            expect(dissentersExpected).to.equal(dissentersResult);

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
    });
});