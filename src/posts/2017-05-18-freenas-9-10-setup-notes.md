---
title: FreeNAS 9.10+ Setup Notes
date: 2017-05-19 06:27:45
excerpt: A collection of notes and tips for configuring FreeNAS 9, particularly for people switching from Synology, focused mostly on Windows shares.
categories: guides
tags:
- freenas
- ssh
- unix
- windows
- smb
- cifs
- permissions
- nas

---
This is a collection of notes I took while setting up a new NAS running FreeNAS 9.10. The issues I ran into initially were around enabling SSH and correctly configuring SMB/CIFS Shares for Windows. Maybe I just missed something obvious, or maybe these are actual issues that have plagued others before, but I plan on updating this as needed.

## Switching from Synology DiskStation to FreeNAS

A few weeks ago I noticed that my Synology NAS (the DS716+ II unit) was running low on available space. As this device only has 2 bays, both of which are occupied with 3TB HDDs (using Synology's Hybrid RAID), I figured it would be wiser to acquire new enclosure with more bays, rather than to swap in larger HDDs and have to mount the current drives somewhere else to facilitate the data transfer.

However, I couldn't bring myself to spend hundreds of dollars on a pre-made device with such under-powered hardware, and I definitely couldn't justify spending $1000.00 (or more) on the few devices that better aligned with my hardware requirements.

So I spent many nights researching both hardware and software for a DIY NAS. I may post my actual NAS build at some point, but this post is specifically for documenting some of the nuances I encountered with FreeNAS (which is what I have currently elected to use on my DIY NAS).

## Enabling SSH (and Mounting the FreeNAS Filesystem)

I sincerely hope this is just a bug with FreeNAS 9.10, but for me, simply enabling the SSH service didn't actually allow me to connect via SSH to the box. Using the shell tool built into the FreeNAS Web GUI, I found that sshd wasn't running (`service sshd status`).

So I had to manually enable sshd by adding `sshd_enable="YES"` to the `/etc/rc.conf` file. After that I could SSH into my NAS and everything seemed fine. Upon rebooting the machine, though, SSH was once again disabled, and the `/etc/rc.conf` file no longer had my addition to enable sshd. What gives?!

It turns out you have to mount the FreeNAS filesystem root in write mode before making changes to the system files. So here's what I had to do:

``` shell-session
$ mount -uw /
$ nano /etc/rc.conf    # or whatever your editor of choice is (except vim, of course...)
```

**Bottom line**: if you are going to modify any files from the FreeNAS filesystem, make sure you mount it first. Even though you can see and modify the files, they are reset when the system reboots.

## User Storage and "Dynamic" Windows Shares (via SMB)

This caused me tremendous headache, and, to be honest, my solution may not be complete (or secure).

What I wanted to do was share each user's home directory to Windows, but do so with a "dynamic" mount point. Synology DiskStation exposes this functionality very simply, and I have found it to be tremendously useful for a network with a handful of users.

### What I Wanted

Any user on the network could mount **\\ [SERVER\_NAME] \ Home** (spaces added for legibility) as a network drive in Windows, and have that automatically point to their own home directory on the NAS with write permissions.

After searching the Internet, I realized that most guides and forum posts where for FreeNAS 9.3 or earlier, which utilized CIFS for the Windows shares. Unfortunately, FreeNAS 9.10 uses Samba instead, and the configuration is notably different.

So here's a step-by-step of what I have done. Some of these steps may be unnecessary, but none of them are counter-productive (as best I can tell).

1. Create a dataset for the home(s) root directory
    - Example path: **/ mnt / [POOL\_NAME] / [DATASET\_NAME] / homes** (spaces added for legibility)
    - I used a Unix share type, as at least my own user would be using the same directory in Linux and Windows
1. Create a dataset for each user under the home(s) dataset
    - The dataset name should match the user's Windows username
    - Example path: **/ mnt / [POOL\_NAME] / [ROOT\_DATASET\_NAME] / homes / [USERNAME]** (spaces added for legibility)
    - I again used a Unix share type for these directories
1. Create a "users" group
1. Create a user for each person who will be accessing the NAS
    - I left the primary group as their username (typical for Linux), and added them to the "users" group as an auxiliary
    - The username **must** match their username from Windows, unless you want to create more headache down the road...
    - Point their home directory to the directory you created in step 2
1. Back under the storage section, ensure the home(s) dataset has the following **permission** settings:
    - **Apply Owner**: checked
    - **Owner (user)**: root
    - **Apply Group**: checked
    - **Owner (group)**: users
    - **Apply Mode**: checked
    - **Mode** (check the following):
        - **Read**: Owner, Group, Other
        - **Write**: Owner, Group
        - **Execute**: Owner, Group, Other
    - **Permission Type**: Unix
1. Now ensure each of the datasets for your users have the following **permission** settings:
    - **Apply Owner**: checked
    - **Owner (user)**: [username]
    - **Apply Group**: checked
    - **Owner (group)**: [username]
    - **Apply Mode**: checked
    - **Mode** (check the following):
        - **Read**: Owner, Group, Other
        - **Write**: Owner, Group
        - **Execute**: Owner, Group, Other
    - **Permission Type**: Unix
1. Create a new Windows (SMB) Share as follows
    - **Path**: select the home(s) folder from step 2
        - Example path: **/ mnt / [POOL\_NAME] / [DATASET\_NAME] / homes** (spaces added for legibility)
    - **Use as home share**: UNCHECKED
        - This is what threw me for a long time, as normally you would want to check this box, but doing so has several caveats
    - **Name**: Home
        - Whatever value you use here will be the "folder" of the network path used in Windows
        - Do NOT use "homes" as that is a special value in Samba that will have some unwanted results
    - **Apply Default Permissions**: checked
    - **Browsable to Network Clients**: checked
    - **Allow Guest Access**: UNCHECKED
        - You don't want someone to be able to access a different user's stuff, do you?
    - **Auxiliary Parameters**:
        ``` ini
        valid users = %U
        path = %H
        ```

1. Wait for the Samba service to restart (or manually restart it using `service samba_server restart` via shell/SSH)
1. On a Windows machine, access **\\ [SERVER\_NAME] \ Home** (removing the spaces I added for legibility)
    - Assuming your Windows username matches one of the users you setup in FreeNAS, you should be taken to "your" home directory, and you should be able to create, update, and delete files and folders

### The Resulting Samba Configuration

Your `/etc/local/smb4.conf` file should end up with an entry like this (note the 2 bottom lines):

``` ini
[Home]
    path = /mnt/my-pool/data/homes
    comment = Home Directories
    printable = no
    veto files = /.snapshot/.windows/.mac/.zfs/
    writeable = yes
    browseable = yes
    shadow:snapdir = .zfs/snapshot
    shadow:sort = desc
    shadow:localtime = yes
    shadow:format = auto-%Y%m%d.%H%M-1m
    shadow:snapdirseverywhere = yes
    vfs objects = shadow_copy2 zfs_space zfsacl streams_xattr aio_pthread
    hide dot files = yes
    guest ok = no
    nfs4:mode = special
    nfs4:acedup = merge
    nfs4:chown = true
    zfsacl:acesort = dontcare
    valid users = %U    #important
    path = %H           #important
```

### The Important Pieces

- Don't use the "Use as home share" option for your Windows (SMB) Share of the home(s) directory, as that exposes folders for each user to the network (as well as an extra "homes" folder), and doesn't seem to correctly set access permissions.
- Use the Auxiliary Parameters I provided above for the Windows (SMB) Share of the home(s) directory.
  - These values remap the path to the connecting user's home directory (instead of exposing the parent home(s) directory to everyone) and ensures that user is given access.
- Don't just manually add an entry to the `/etc/local/smb4.conf` file, as the FreeNAS Web GUI doesn't seem to pick those up (which means you can end up with duplicate entries). Always create a new share via the FreeNAS Web GUI and just add your auxiliary Samba configs there.
