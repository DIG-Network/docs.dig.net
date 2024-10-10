---
sidebar_position: 3
---

# Developer Setup

### DIG Project Deployment Guide

Before you begin deploying your project to the DIG Network, ensure that you have completed the one-time setup of your DIG Node as described in the previous guide. This includes:

1. Installing the `dig-chia-cli` on your **development machine**:
   ```bash
   npm install @dignetwork/dig-chia-cli@alpha -g
   ```

2. Setting up your DIG Node on the **web server** and syncing your mnemonic with the DIG CLI.

Once your DIG Node is fully configured, you're ready to proceed with the following steps in the project directory where your dApp or project is located.

3. **Optional**: If you are publishing a dApp from a machine other than the one that is running your DIG Node, execute these setup steps on that machine. Use the same credentials and seed as you did for your DIG Node.

```bash
npm install @dignetwork/dig-chia-cli@alpha -g
dignode remote set peer <dig node public ip address> --username <generated username> --password <generated password>
dignode remote sync seed
```

---

#### Step 1: Prepare Your Project

1. **Add `.dig` to `.gitignore`:**
   - Open your project directory.
   - Add `.dig` to your `.gitignore` file to ensure that DIG-related files are not tracked by Git:
     ```bash
     echo ".dig" >> .gitignore
     ```

2. **Build Your Project:**
   - Compile your project, directing the output to the `./dist` folder (or any build folder of your choice). By default, the DIG CLI looks for the `./dist` folder:

     ```bash
     npm run build # example for a nodejs dApp
     ```

   - Ensure that your compiled files are present in the `./dist` as that is where they will be added to the network from.

---

#### Step 2: Initialize DIG for Your Project

1. **Initialize DIG:**
   - Run the following command in your project directory to set up DIG:
     ```bash
     dignode init
     ```
   - This will create a `.dig` folder in your project directory and register an empty data store on the blockchain. Wait for the blockchain transaction to confirm before proceeding.
   - *Note*: If you wish to deploy a folder other than the `./dist` folder, this is configurable in the `.dig/dig.config.json` file that is generated after this step.

---

#### Step 3: Commit Your Build to the Data Store

1. **Commit the `dist` Folder:**
   - Ensure that your compiled app and/or content files are present in the `./dist` folder before proceeding.
   - Use the following command to commit your `dist` folder (or your chosen build directory) to the DIG data store:
     ```bash
     dignode commit
     ```
   - This command inserts all files from the `./dist` folder into the Merkle root of your data store and updates the blockchain with the new Merkle root. Wait for the transaction to confirm.

---

#### Step 4: Push Your Data to the DIG Node

1. **Push to the DIG Node:**
   - Once the files are committed to the data store, upload them to your DIG Node with the following command:
     ```bash
     dignode push
     ```
   - Enter the IP address of your dig node when prompted for a peer address.
   - Ensure your DIG Node is set up and running according to the previous setup guide. This command verifies file integrity and permissions during the upload process.

---

#### Step 5: Verify Your dApp on the DIG Network

1. **Check Availability:**
   - After the push is complete, your DIG Node will detect the new store and register it with the DIG Network. To verify, visit your DIG Node's public IP in a browser:
     ```http
     http://your.ip.address
     ```
   - You should see your dApp listed and accessible. Congratulations! Your dApp is now live on the DIG Network.

---

#### Step 6: Accessing Your dApp via the Network

Once your dApp is live on the network, it can be accessed by clients, browsers, or any domain acting as a cache service. Soon, the DIG Network will support a **Universal DataLayer Identifier (UDI)** for easier discovery and access. This feature is under active development, and updates will be provided as it becomes available.

**In the Meantime:**
- You can use **nginx** or a **reverse proxy** to map your data store to a domain and serve your dApp like a traditional website.