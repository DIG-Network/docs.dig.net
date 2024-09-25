---
sidebar_position: 2
---

# DIG Node Setup Guide

A DIG Node is a data layer-powered web server that allows you to deploy and manage data and applications. This guide will walk you through setting up the DIG CLI on your **development machine**, configuring your DIG Node on your **web server**, and finally syncing your wallet seed securely. Please note that there are **two machines** involved in the process:

- **Development Machine**: Where you will install and configure the DIG CLI to interact with your DIG Node. Usually the machine that has the code you want to deploy.
- **Web Server**: Where the DIG Node will be installed and run using Docker.

---

## Prerequisites

Before starting, ensure you meet the following prerequisites:

### On the Development Machine:
- **Node.js and NPM installed** for using the DIG CLI.
  - [Node.js Installation Guide](https://nodejs.org/en/download/)

### On the Web Server:
- **Docker and Docker Compose installed** to run the DIG Node.
  - [Docker Installation Guide](https://docs.docker.com/get-docker/)
  - [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

- **Ability to open the necessary ports** (80, 4159, 4160, 4161) for your DIG Node on your web server's firewall.

---

## Step 1: Configure the Development Machine

### 1. Install Node.js and NPM

Ensure that **Node.js version 20** and **NPM** are installed on your **development machine**. If you don't have them installed, you can follow the official installation instructions [here](https://nodejs.org/en/download/).

### 2. Install the DIG CLI

Run the following command to globally install the DIG CLI on your **development machine**:

```bash
npm install @dignetwork/dig-chia-cli@alpha -g
```

This will allow you to interact with your DIG Node and manage your wallets from your local machine.

---

## Step 2: Create a Dedicated Mnemonic for DIG on the Development Machine

The DIG CLI and DIG Node Server require a **dedicated mnemonic** to operate. This mnemonic is used for signing transactions and interacting with the blockchain. For security, it is recommended that you create a new wallet specifically for running your DIG Node and keep only enough balance to operate the node.

### 1. Create a New Wallet Seed

- Open the official Chia UI on your **development machine**.
- Create a new wallet and name it `DIGNode`.
- Fund this wallet with some XCH. It is recommended to maintain at least 3 XCH for fees and staking. During this process up to 1 XCH may be staked per store at any given time. You need to maintain a balance sufficent to support these transactions. Staked funds are returned after there usage is up.

By creating this wallet on the official Chia UI you are able to monitor the balance of XCH on your DIG Node easily and top it off when needed.

---

## Step 3: Set Up the DIG Node on Your Web Server

Now that the DIG CLI is configured on your **development machine**, you will configure the DIG Node on your **web server**.

### 1. Clone the DIG Node Repository on the Web Server

SSH into your **web server** and clone the DIG Node repository to your user directory:

```bash
git clone https://github.com/DIG-Network/chia-dig-node
cd chia-dig-node
```

### 2. Install the DIG Node on the Web Server

Run the installation script on your **web server**:

```bash
sudo ./install.sh
```

The installation script will:

- Automatically generate a `docker-compose.yml` file, including the **DIG_USERNAME** and **DIG_PASSWORD**, which will be used to secure your DIG Node.
- Open the necessary ports (80, 4159, 4160) in the firewall automatically.
- Set up Docker containers for the DIG Node services.
- Configure the DIG Node to run as a `systemd` service, ensuring it starts on boot and runs in the background.

### Important: Retrieve Credentials from the `docker-compose.yml`

Once the installation is complete, you will need the **generated credentials** (`DIG_USERNAME` and `DIG_PASSWORD`) from the `docker-compose.yml` file to configure the DIG CLI. These credentials are crucial for securing communication between your DIG CLI and the DIG Node.

**To retrieve the credentials**, open the `docker-compose.yml` file on your web server:
```bash
cat docker-compose.yml
```

Make a note of the `DIG_USERNAME` and `DIG_PASSWORD`. You will use them in the next step.

---

## Step 4: Configure the DIG CLI with Your DIG Node Credentials

Now that your DIG Node is running on the **web server**, you need to configure your DIG CLI on the **development machine** to connect to the DIG Node using the **generated credentials**.

### 1. Set Credentials for Your DIG Node

On your **development machine**, run the following command to set the credentials for your DIG Node. Replace `<dig node public IP>`, `<generated username>`, and `<generated password>` with the values retrieved from your **web server**:

```bash
dignode remote set peer <dig node public ip address> --username <generated username> --password <generated password>
```

**Important**: Always use the **generated username and password** from the `docker-compose.yml` for security. Do not manually generate or use your own credentials.

This command establishes a secure connection between your DIG CLI and your DIG Node.

---

## Step 5: Sync the Mnemonic to Your DIG Node

Once the credentials have been set, you can sync the mnemonic you created earlier to the DIG Node.

### 1. Sync the Mnemonic with Your DIG Node

On your **development machine**, run the following command to sync your wallet seed to your DIG Node:

```bash
dignode remote sync seed
```

This command sends your wallet seed to the DIG Node so it can manage server coins and interact with the blockchain.

### 2. Secure Connection (mTLS)

All interactions between your DIG CLI and the DIG Node, including syncing the mnemonic, are performed using mTLS (mutual Transport Layer Security) and are fully encrypted for security.

---

## Step 6: Verify Your DIG Node Setup

After syncing the mnemonic, you should verify that your DIG Node is set up correctly.

### 1. Check Node Status

Run the following command on your **web server** to check the status of your DIG Node:

```bash
sudo systemctl status dig@<username>.service
```

### 2. Test the DIG Node in a Browser

Visit `http://<your-public-ip>` in a web browser. If you see a page with the header "Index of Stores," your DIG Node is running correctly.

---

## Step 7: Uninstallation and Upgrades

### Uninstall

To uninstall the DIG Node on your **web server**, you can run the provided uninstall script:

```bash
sudo ./uninstall.sh
```

### Upgrade

To upgrade your DIG Node to use the latest containers, run the upgrade script on your **web server**:

```bash
sudo ./upgrade-node.sh
```

---

By following these steps, you will have successfully set up a DIG Node with a dedicated mnemonic and synced it securely. This setup ensures that your DIG Node is secure, always accessible, and ready for deploying data and applications.

---

### Summary of Key Steps:

1. **Development Machine**: Set up the DIG CLI, create a wallet, and import a mnemonic.
2. **Web Server**: Install the DIG Node using Docker by running `sudo ./install.sh`, retrieve the generated credentials, and start the service.
3. **Connect and Sync**: Use the DIG CLI to securely set the credentials and sync the mnemonic to your DIG Node using mTLS encryption.