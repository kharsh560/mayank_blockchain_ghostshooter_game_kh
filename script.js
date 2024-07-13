const { ethers } = window.ethers;

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address
const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function donate_to_organisation(address _org_address, uint amount)",
  "function getTokens(uint amount)",
  "function register_org(address _org, string memory _name, string memory _description, uint _funds)",
];

async function init() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Display user's account
    const accounts = await provider.send("eth_requestAccounts", []);
    document.getElementById(
      "account"
    ).innerText = `Connected account: ${accounts[0]}`;

    // Check balance
    document.getElementById("checkBalance").onclick = async () => {
      const balance = await contract.balanceOf(accounts[0]);
      document.getElementById(
        "balance"
      ).innerText = `Your balance: ${ethers.utils.formatEther(balance)} GC`;
    };

    // Donate to organisation
    document.getElementById("donate").onclick = async () => {
      const orgAddress = document.getElementById("orgAddress").value;
      const amount = document.getElementById("donationAmount").value;
      const tx = await contract.donate_to_organisation(
        orgAddress,
        ethers.utils.parseEther(amount)
      );
      await tx.wait();
      alert("Donation successful!");
    };

    // Get tokens
    // document.getElementById("getTokens").onclick = async () => {
    //   const amount = document.getElementById("getTokenAmount").value;
    //   const tx = await contract.getTokens(ethers.utils.parseEther(amount));
    //   await tx.wait();
    //   alert("Tokens transferred!");
    // };
    document.getElementById("getTokens").onclick = () => {
      let amountFromKills = document.getElementById("getTokenAmount").value;
      amountFromKills = c2_callFunction("getKills");
      document.getElementById("getTokenAmount").value = c2_callFunction("getKills");
    };

    // Register organisation
    document.getElementById("registerOrg").onclick = async () => {
      const orgName = document.getElementById("orgName").value;
      const orgDescription = document.getElementById("orgDescription").value;
      const orgFunds = document.getElementById("orgFunds").value;
      const tx = await contract.register_org(
        accounts[0],
        orgName,
        orgDescription,
        orgFunds
      );
      await tx.wait();
      alert("Organisation registered!");
    };
  } else {
    // alert("Please install MetaMask!");
    console.log("Please install MetaMask!");
  }
}

window.onload = init;

// KH
// const iframe = document.getElementById("gameFrame");
// const kills = iframe.contentWindow.c2_callFunction("getKills");
// console.log("Kills:", kills);

// Assuming your iframe has an id="gameFrame"
const iframe = document.getElementById("gameFrame");

// Example of sending a message to the iframe
iframe.contentWindow.postMessage("getKills", "https://ms-10182.github.io");

// Example of receiving a message from the iframe
window.addEventListener("message", (event) => {
  if (
    event.origin === "https://ms-10182.github.io" &&
    event.data === "killsReceived"
  ) {
    // Handle the response from the iframe
    console.log("Kills received from game:", event.data);
  }
});
