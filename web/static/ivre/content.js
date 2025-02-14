/*
 * This file is part of IVRE.
 * Copyright 2011 - 2020 Pierre LALET <pierre@droids-corp.org>
 *
 * IVRE is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * IVRE is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public
 * License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with IVRE. If not, see <http://www.gnu.org/licenses/>.
 */

/************* Help methods ****************/

function prepare(help) {
    var key;
    // Apply aliases
    for (key in help.aliases) {
	help.content[key] = help.content[help.aliases[key]];
    }

    // Manage negation
    for (key in help.content) {
	if(help.content[key].title.substr(0, 10) === '<b>(!)</b>') {
	    help.content["!" + key] = help.content[key];
	    help.content["-" + key] = help.content[key];
	}
    }

    // Manage optional parameters
    for (key in help.content) {
	if(help.content[key].title.indexOf("<b>(:") !== -1) {
	    help.content[key + ":"] = help.content[key];
	}
    }
}

/************* Help content ****************/

var HELP_FILTERS = {
    config: {
	"prefixes": "!-",
	"suffixes": ":/",
    },
    callbacks: [
	function(elt, HELP, ToolTip) {
	    // Handle IP addresses
	    if(elt.value.match(/^[!-]?[0-9\.\/\,]*$/)) {
		var content;
		if(elt.value.indexOf('/') !== -1) {
		    content = HELP.content["net:"];
		}
		else if(elt.value.indexOf('.') !== -1) {
		    content = HELP.content["host:"];
		}
		else {
		    content = HELP.content["tcp/"];
		}
		ToolTip.set(elt, content);
		return false;
	    } else {
		return true;
	    }
	},
    ],
    aliases: {
	"yp": "nis",
	"devicetype:": "devtype:",
	"networkdevice": "netdev",
    },
    content: {
	/* filters */
	"id:": {
	    "title": "<b>(!)</b>id:<b>[object ID](,[object ID](,...))</b>",
	    "content": "Look for results with a specific ObjectID.",
	},
	"host:": {
	    "title": "<b>(!)[IP address]</b> or <b>(!)</b>host:<b>[IP address]</b>",
	    "content": "Look for results for one specific IP address.",
	},
	"net:": {
	    "title": "<b>(!)[IP address / netmask]</b> or <b>(!)</b>net:<b>[IP address / netmask]</b>",
	    "content": "Look for results within a specific network (CIDR notation).",
	},
	"range:": {
	    "title": "<b>(!)</b>range:<b>[IP address]-[IP address]</b>",
	    "content": "Look for results within a specific IP range.",
	},
	"ipv4": {
	    "title": "<b>(!)</b>ipv4",
	    "content": "Look for results within the IPv4 range.",
	},
	"ipv6": {
	    "title": "<b>(!)</b>ipv6",
	    "content": "Look for results within the IPv6 range.",
	},
	"hostname:": {
	    "title": "<b>(!)</b>hostname:<b>[FQDN]</b>",
	    "content": "Look for results with a matching hostname ([FQDN] can be specified as the exact value or a /regexp/).",
	},
	"domain:": {
	    "title": "<b>(!)</b>domain:<b>[FQDN]</b>",
	    "content": "Look for results with a hostname within a matching domain name ([FQDN] can be specified as the exact value or a /regexp/).",
	},
	"category:": {
	    "title": "<b>(!)</b>category:<b>[exact_value or /regexp/]</b>",
	    "content": "Look for results tagged with a matching category.",
	},
	"country:": {
	    "title": "<b>(!)</b>country:<b>[two letters code]</b>",
	    "content": "Look for hosts located in a specific country.",
	},
	"city:": {
	    "title": "<b>(!)</b>city:<b>[exact_value or /regexp/]</b>",
	    "content": "Look for hosts located in a specific city. <b>Use with a <code>country:</code> filter</b>.",
	},
	"asnum:": {
	    "title": "<b>(!)</b>asnum:<b>[number(,number(,...))]</b>",
	    "content": "Look for hosts assigned to a specific AS given its number. Coma-separated multiple values can be used. See also <code>asname:</code>.",
	},
	"asname:": {
	    "title": "<b>(!)</b>asname:<b>[exact_value or /regexp/]</b>",
	    "content": "Look for hosts assigned to a specific AS given its name. See also <code>asnum:</code>.",
	},
	"source:": {
	    "title": "<b>(!)</b>source:<b>[exact_value or /regexp/]</b>",
	    "content": "Look for results obtained from a specific source.",
	},
	"timerange:": {
	    "title": "<b>(!)</b>timerange:<b>[timestamp]-[timestamp]</b>",
	    "content": "Look for results within a specific time range.",
	},
	"timeago:": {
	    "title": "<b>(!)</b>timeago:<b>[time]</b>",
	    "content": "Look for results more recent than the specified value. Time can be specified in seconds (the default), minutes (add <b>m</b>), hours (add <b>h</b>), days (add <b>d</b>), or years (add <b>y</b>).",
	},
	"service:": {
	    "title": "service:<b>[service name](:[port number])</b>",
	    "content": "Look for a particular service, optionally on the specified port. [service name] can be either the exact value or a /regexp/.",
	},
	"product:": {
	    "title": "product:<b>[service name]:[product name](:[port number])</b>",
	    "content": "Look for a particular service and product, optionally on the specified port. [service name] and [product name] can be either exact values or /regexps/.",
	},
	"version:": {
	    "title": "version:<b>[service name]:[product name]:[version](:[port number])</b>",
	    "content": "Look for a particular service, product and version, optionally on the specified port. [service name], [product name] and [version] can be either exact values or /regexps/.",
	},
	"script:": {
	    "title": "<b>(!)</b>script:<b>[script id](:[script output])</b>",
	    "content": "Look for a port script, given its id, and optionally for a specific output. Both [script id] and [script output] can be either exact values or /regexps/.",
	},
	/* results of scripts or version scans */
	"anonftp": {
	    "title": "anonftp",
	    "content": "Look for FTP servers allowing anonymous access.",
	},
	"anonldap": {
	    "title": "anonldap",
	    "content": "Look for LDAP servers with anonymous bind working.",
	},
	"authbypassvnc": {
	    "title": "authbypassvnc",
	    "content": "Look for VNC servers with authentication that can be bypassed.",
	},
	"authhttp": {
	    "title": "authhttp",
	    "content": "Look for HTTP servers requiring authentication with default credentials working (the Nmap script seems to get a lot of false positives).",
	},
	"banner:": {
	    "title": "banner:<b>[exact_value or /regexp/]</b>",
	    "content": "Look for content in service banners (as discovered by Nmap script &quot;banner&quot;).",
	},
	"cookie:": {
	    "title": "cookie:<b>[name]</b>",
	    "content": "Look for HTTP servers setting a specific cookie.",
	},
	"file": {
	    "title": "file<b>(:([scrtipt id](,[script id](,...)):)[filename or /regexp/])</b>",
	    "content": "Look for a pattern in the shared files (FTP, SMB, ...).",
	},
	"geovision": {
	    "title": "geovision",
	    "content": "Look for Geovision webcams (see also <code>devtype:webcam</code>).",
	},
	"httptitle:": {
	    "title": "httptitle:<b>[exact_value or /regexp/]</b>",
	    "content": "Look for results with a specific title on the root page of an HTTP server.",
	},
	"nfs": {
	    "title": "nfs",
	    "content": "Look for NFS servers",
	},
	"nis": {
	    "title": "<b>nis</b> or <b>yp</b>",
	    "content": "Look for NIS (YP) servers",
	},
	"mssqlemptypwd": {
	    "title": "mssqlemptypwd",
	    "content": "Look for MS-SQL servers with an empty password for the <code>sa</code> account.",
	},
	"mysqlemptypwd": {
	    "title": "mysqlemptypwd",
	    "content": "Look for MySQL servers with an empty password for the <code>root</code> account.",
	},
	"httphdr": {
	    "title": "httphdr<b>(:[header](:[value]))</b>",
	    "content": "Look for HTTP headers."
	},
	"httpapp": {
	    "title": "httpapp<b>(:[name](:[version]))</b>",
	    "content": "Look for HTTP applications."
	},
	"owa": {
	    "title": "owa",
	    "content": "Look for OWA (Outlook Web App) servers.",
	},
	"phpmyadmin": {
	    "title": "phpmyadmin",
	    "content": "Look for PHPMyAdmin servers.",
	},
	"smb.lanmanager:": {
	    "title": "smb.lanmanager:[LAN Manager]",
	    "content": "Search results with SMB service with a specific LAN Manager.",
	},
	"smb.os:": {
	    "title": "smb.os:[OS]",
	    "content": "Search results with SMB service reporting a specific OS.",
	},
	"smb.smb-version:": {
	    "title": "smb.smb-version:[Version]",
	    "content": "Search results with a specific version of the SMB protocol.",
	},
	"smb.guid:": {
	    "title": "smb.guid:[GUID]",
	    "content": "Search results with SMB service with a specific GUID.",
	},
	"ntlm.domain_dns:": {
	    "title": "ntlm.domain_dns:[DNS]",
	    "content": "Search results with NTLM protocol in a specific DNS domain.",
	},
	"ntlm.domain:": {
	    "title": "ntlm.domain:[NetBIOS]",
	    "content": "Search results with NTLM protocol in a specific NetBIOS domain.",
	},
	"ntlm.fqdn:": {
	    "title": "ntlm.fqdn:[FQDN]",
	    "content": "Search results with NTLM protocol in a specific host name (FQDN).",
	},
	"ntlm.forest:": {
	    "title": "ntlm.forest:[DNS]",
	    "content": "Search results with NTLM protocol in a specific forest (DNS tree name).",
	},
	"ntlm.os:": {
	    "title": "ntlm.os:[Version]",
	    "content": "Search results with NTLM protocol reporting a specific OS.",
	},
	"ntlm.version:": {
	    "title": "ntlm.version:[Version]",
	    "content": "Search results with a specific version of the NTLM protocol.",
	},
	"ntlm.server:": {
	    "title": "ntlm.server:[NetBIOS]",
	    "content": "Search results with NTLM protocol with a specific host name (NetBIOS).",
	},
	"ntlm.name:": {
	    "title": "ntlm.name:[NetBIOS]",
	    "content": "Search results with NTLM protocol with a specific host name (NetBIOS).",
	},
	"ntlm.workgroup:": {
	    "title": "ntlm.workgroup:[NetBIOS]",
	    "content": "Search results with NTLM protocol in a specific workgroup (NetBIOS).",
	},
	"ntlm.DNS_Domain_Name:": {
	    "title": "ntlm.DNS_Domain_Name:[DNS]",
	    "content": "Search results with NTLM protocol in a specific DNS domain.",
	},
	"ntlm.NetBIOS_Domain_Name:": {
	    "title": "ntlm.NetBIOS_Domain_Name:[NetBIOS]",
	    "content": "Search results with NTLM protocol in a specific NetBIOS domain.",
	},
	"ntlm.DNS_Computer_Name:": {
	    "title": "ntlm.DNS_Computer_Name:[FQDN]",
	    "content": "Search results with NTLM protocol in a specific host name (FQDN).",
	},
	"ntlm.DNS_Tree_Name:": {
	    "title": "ntlm.DNS_Tree_Name:[DNS]",
	    "content": "Search results with NTLM protocol in a specific forest (DNS tree name).",
	},
	"ntlm.Product_Version:": {
	    "title": "ntlm.Product_Version:[Version]",
	    "content": "Search results with NTLM protocol reporting a specific OS.",
	},
	"ntlm.NTLM_Version:": {
	    "title": "ntlm.NTLM_Version:[Version]",
	    "content": "Search results with a specific version of the NTLM protocol.",
	},
	"ntlm.NetBIOS_Computer_Name:": {
	    "title": "ntlm.NetBIOS_Computer_Name:[NetBIOS]",
	    "content": "Search results with NTLM protocol with a specific host name (NetBIOS).",
	},
	"ntlm.Workgroup:": {
	    "title": "ntlm.Workgroup:[NetBIOS]",
	    "content": "Search results with NTLM protocol in a specific workgroup (NetBIOS).",
	},
	"smbshare": {
	    "title": "smbshare<b>(:[access mode])</b>",
	    "content": "Search results with SMB shares with anonymous access. Access can be 'r', 'w' or 'rw' (default is read or write).",
	},
	"sshkey": {
	    "title": "sshkey<b>(:[output of ssh-hostkey script])</b>",
	    "content": "Look for hosts with SSH host keys reported by Nmap.",
	},
	"sshkey.type:": {
	    "title": "sshkey.type:(<b>[key type])</b>",
	    "content": "Look for hosts with at least one SSH host key of specified type.",
	},
	"sshkey.bits:": {
	    "title": "sshkey.bits:(<b>[key length])</b>",
	    "content": "Look for hosts with at least one SSH host key of specified length.",
	},
	"sshkey.fingerprint:": {
	    "title": "sshkey.fingerprint:(<b>[fingerprint])</b>",
	    "content": "Look for hosts with a specific SSH host key, given its fingerprint.",
	},
	"sshkey.key:": {
	    "title": "sshkey.key:(<b>[base64 encoded key])</b>",
	    "content": "Look for hosts with a specific SSH host key.",
	},
	"torcert": {
	    "title": "torcert",
	    "content": "Look for Tor certificates.",
	},
	"vuln": {
	    "title": "vuln<b>(:[vuln id](:[status]))</b>",
	    "content": "Look for vulnerabilities found by NSE scripts.",
	},
	"webfiles": {
	    "title": "webfiles",
	    "content": "Look for &quot;typical&quot; Web files. See also <code>file:</code>.",
	},
	"webmin": {
	    "title": "webmin",
	    "content": "Look for Webmin servers.",
	},
	"x11open": {
	    "title": "x11open",
	    "content": "Look for open X11 servers.",
	},
	"x11srv": {
	    "title": "x11",
	    "content": "Look for X11 servers. See also <code>x11open</code>.",
	},
	"xp445": {
	    "title": "xp445",
	    "content": "Look for Windows XP machines with TCP/445 port open.",
	},
        "cert.keytype:": {
            "title": "cert.keytype:[exact value or /regexp/]",
            "content": "Look for a particular certificate public key type.",
        },
        "cert.self_signed": {
            "title": "<b>(!)</b>cert.self_signed",
            "content": "Look for self signed certificates.",
        },
        "cert.subject:": {
            "title": "cert.subject:[exact value or /regexp/]",
            "content": "Look for a particular certificate subject.",
        },
        "cert.issuer:": {
            "title": "cert.subject:[exact value or /regexp/]",
            "content": "Look for a particular certificate issuer.",
        },
        "cert.md5:": {
            "title": "cert.md5:[MD5 hash or /MD5 hash regexp/]",
            "content": "Look for a particular certificate, based on the MD5 hash.",
        },
        "cert.sha1:": {
            "title": "cert.sha1:[SHA1 hash or /SHA1 hash regexp/]",
            "content": "Look for a particular certificate, based on the SHA1 hash.",
        },
        "cert.sha256:": {
            "title": "cert.sha256:[SHA256 hash or /SHA256 hash regexp/]",
            "content": "Look for a particular certificate, based on the SHA256 hash.",
        },
        "cert.pkmd5:": {
            "title": "cert.pkmd5:[MD5 hash or /MD5 hash regexp/]",
            "content": "Look for a particular certificate public key, based on the MD5 hash.",
        },
        "cert.pksha1:": {
            "title": "cert.pksha1:[SHA1 hash or /SHA1 hash regexp/]",
            "content": "Look for a particular certificate public key, based on the SHA1 hash.",
        },
        "cert.pksha256:": {
            "title": "cert.pksha256:[SHA256 hash or /SHA256 hash regexp/]",
            "content": "Look for a particular certificate public key, based on the SHA256 hash.",
        },
        "cacert.keytype:": {
            "title": "cacert.keytype:[exact value or /regexp/]",
            "content": "Look for a particular CA certificate public key type.",
        },
        "cacert.self_signed": {
            "title": "<b>(!)</b>cacert.self_signed",
            "content": "Look for self signed CA certificates.",
        },
        "cacert.subject:": {
            "title": "cacert.subject:[exact value or /regexp/]",
            "content": "Look for a particular CA certificate subject.",
        },
        "cacert.issuer:": {
            "title": "cacert.subject:[exact value or /regexp/]",
            "content": "Look for a particular CA certificate issuer.",
        },
        "cacert.md5:": {
            "title": "cacert.md5:[MD5 hash or /MD5 hash regexp/]",
            "content": "Look for a particular CA certificate, based on the MD5 hash.",
        },
        "cacert.sha1:": {
            "title": "cacert.sha1:[SHA1 hash or /SHA1 hash regexp/]",
            "content": "Look for a particular CA certificate, based on the SHA1 hash.",
        },
        "cacert.sha256:": {
            "title": "cacert.sha256:[SHA256 hash or /SHA256 hash regexp/]",
            "content": "Look for a particular CA certificate, based on the SHA256 hash.",
        },
        "cacert.pkmd5:": {
            "title": "cacert.pkmd5:[MD5 hash or /MD5 hash regexp/]",
            "content": "Look for a particular CA certificate public key, based on the MD5 hash.",
        },
        "cacert.pksha1:": {
            "title": "cacert.pksha1:[SHA1 hash or /SHA1 hash regexp/]",
            "content": "Look for a particular CA certificate public key, based on the SHA1 hash.",
        },
        "cacert.pksha256:": {
            "title": "cacert.pksha256:[SHA256 hash or /SHA256 hash regexp/]",
            "content": "Look for a particular CA certificate public key, based on the SHA256 hash.",
        },
	"ssl-ja3-client": {
	    "title": "(!)ssl-ja3-client<b>(:[JA3])</b>",
	    "content": "Look for hosts with a JA3 or with the given JA3.",
	},
	"ssl-ja3-server": {
	    "title": "(!)ssl-ja3-server<b>(:[JA3S](:[JA3]))</b>",
	    "content": "Look for hosts with a JA3S, with the given JA3S, with a JA3S corresponding to the given JA3 or with the given JA3S corresponding to the given JA3",
	},
	"ssl-jarm": {
	    "title": "(!)ssl-jarm<b>(:[JARM])</b>",
	    "content": "Look for hosts with a JARM fingerprint (specific, if specified)",
	},
	"hassh": {
	    "title": "hassh<b>(:[HASSH])</b>",
	    "content": "Look for hosts with a HASSH fingerprint (specific, if specified)",
	},
	"hassh-client": {
	    "title": "hassh-client<b>(:[HASSH])</b>",
	    "content": "Look for hosts with a HASSH client fingerprint (specific, if specified)",
	},
	"hassh-server": {
	    "title": "hassh-server<b>(:[HASSH])</b>",
	    "content": "Look for hosts with a HASSH server fingerprint (specific, if specified)",
	},
	"useragent": {
	    "title": "(!)useragent<b>(:[exact_value or /regexp/])</b>",
	    "content": "Look for hosts using a User-Agent matching the argument."
	},
	/* OS fingerprint */
	"os:": {
	    "title": "os:<b>[exact_value or /regexp/]</b>",
	    "content": "Look for a specific OS, according to Nmap's fingerprint.",
	},
	/* device types */
	"devtype:": {
	    "title": "<b>devtype:</b> or <b>devicetype:[exact_value or /regexp/]</b>",
	    "content": "Look for a specific device type. See also <code>netdev</code>, <code>phonedev</code> and <code>geovision</code>.",
	},
	"netdev": {
	    "title": "netdev",
	    "content": "Look for network devices (e.g., bridges, routers, firewalls, etc.).",
	},
	"phonedev": {
	    "title": "phonedev",
	    "content": "Look for phone devices (e.g., PBX, VoIP devices, phones, etc.).",
	},
	/* CPEs */
	"cpe": {
	    "title": "cpe<b>(:[type](:[vendor](:[product](:[version]))))</b>",
	    "content": "Looks for CPEs matching an expression. Providing no value will match all the hosts that have CPE information. The fields <b>type</b>, <b>vendor</b>, <b>product</b> and <b>version</b> can be exact values or /regexps/. <br/> <i>Ex:</i> o://:linux_kernel or a:apache:http_server:2.2.9",
	},
	/* traceroute */
	"hop:": {
	    "title": "<b>(!)</b>hop:<b>[IP address](:[TTL])</b>",
	    "content": "Look for results with the specified IP address in the Traceroute result.",
	},
	"hopname:": {
	    "title": "<b>(!)</b>hopname:<b>[FQDN]</b>",
	    "content": "Look for results with a matching hostname in the Traceroute result ([FQDN] can be specified as the exact value or a /regexp/).",
	},
	"hopdomain:": {
	    "title": "<b>(!)</b>hopdomain:<b>[FQDN]</b>",
	    "content": "Look for results with a hostname within a matching domain name in the Traceroute result ([FQDN] can be specified as the exact value or a /regexp/).",
	},
	"tcp/": {
	    "title": "<b>(!)[port number](,[port number](,...))</b> or <b>(!)</b>tcp/<b>[port number]</b>",
	    "content": "Look for results with the specified TCP port(s) open.",
	},
	"udp/": {
	    "title": "<b>(!)</b>udp/<b>[port number]</b>",
	    "content": "Look for results with the specified UDP port open.",
	},
	"openport": {
	    "title": "<b>(!)</b>openport",
	    "content": "Look for hosts with at least one open port.",
	},
	"countports:": {
	    "title": "<b>(!)</b>countports:<b>[count](-[count])</b>",
	    "content": "Look for results with open port number within the specified range.",
	},
	"otheropenport:": {
	    "title": "otheropenport:<b>[port number](,[port number](,...))</b>",
	    "content": "Look for hosts with at least one open port other than those listed.",
	},
	"screenshot": {
	    "title": "<b>(!)</b>screenshot<b>(:[port or service])</b>",
	    "content": "Search results with at least one screenshot.",
	},
	"screenwords": {
	    "title": "<b>(!)</b>screenwords<b>(:[word](,[word](,...))(:[port or service]))</b>",
	    "content": "Search results with at least one screenshot containing the provided word(s).",
	},
	"notes": {
	    "title": "notes",
	    "content": "Search results with an associated note.",
	},
	"ike.notification:": {
	    "title": "ike.notification:<b>NOTIFICATION TYPE</b>",
	    "content": "Search results with a specific notification received.",
	},
	"ike.vendor_id.name:": {
	    "title": "ike.vendor_id.name:<b>parsed name</b>",
	    "content": "Search results with a specific IKE Vendor ID.",
	},
	"ike.vendor_id.value:": {
	    "title": "ike.vendor_id.value:<b>raw value</b>",
	    "content": "Search results with a specific IKE Vendor ID.",
	},
	/* sort */
	"skip:": {
	    "title": "skip:<b>[count]</b>",
	    "content": "Skip [count] results.",
	},
	"limit:": {
	    "title": "limit:<b>[count]</b>",
	    "content": "Only display [count] results.",
	},
	"sortby:": {
	    "title": "<b>(!)</b>sortby:<b>[field name]</b>",
	    "content": "Sort according to values for [field name]. Be careful with this setting as consequences on the performances can be terrible when using non-indexed fields.",
	},
	/* display */
	"display:host": {
	    "title": "display:host",
	    "content": "Set the default display mode.",
	},
	"display:port": {
	    "title": "display:port(:<b>([protocol]/)[port],(([protocol]/)[port],(...))</b>)",
	    "content": "Display only (some) ports.",
	},
	"display:service": {
	    "title": "display:service(:<b>[service],([service],(...))</b>)",
	    "content": "Display only (some) services.",
	},
	"display:script": {
	    "title": "display:script(:<b>[script id](,[script id](,...))</b>)",
	    "content": "Display only script outputs. One or more scripts can be specified to only display those scripts' outputs.",
	},
	"display:screenshot": {
	    "title": "display:screenshot",
	    "content": "Display only screenshots.",
	},
	"display:cpe": {
	    "title": "display:cpe",
	    "content": "Display only CPEs.",
	},
	"display:vulnerability": {
	    "title": "display:vulnerability",
	    "content": "Display only vulnerabilities.",
	},
    },
};

prepare(HELP_FILTERS);

/* Top values */

var HELP_TOPVALUES = {
    config: {
	"prefixes": "!-",
	"suffixes": ":",
    },
    callbacks: [],
    aliases: {
	"cpe": "cpe.version",
	"file": "file.filename",
    },
    content: {
	"cpe.type": {
	    "title": "<b>(!)</b>cpe.type<b>(:[type](:[vendor])(:[product](:[version])))</b>",
	    "content": "CPE types (matching optional type / vendor / product / version filter).",
	},
	"cpe.vendor": {
	    "title": "<b>(!)</b>cpe.vendor<b>(:[type](:[vendor])(:[product](:[version])))</b>",
	    "content": "CPE vendors (matching optional type / vendor / product / version filter).",
	},
	"cpe.product": {
	    "title": "<b>(!)</b>cpe.product<b>(:[type](:[vendor])(:[product](:[version])))</b>",
	    "content": "CPE products (matching optional type / vendor / product / version filter).",
	},
	"cpe.version": {
	    "title": "<b>(!)</b>cpe.version<b>(:[type](:[vendor])(:[product](:[version])))</b> or <b>(!)</b>cpe<b>(:[...])",
	    "content": "CPE versions (matching optional type / vendor / product / version filter).",
	},
	"smb.guid": {
	    "title": "<b>(!)</b>smb.guid",
	    "content": "SMB GUIDs.",
	},
	"smb.lanmanager": {
	    "title": "<b>(!)</b>smb.lanmanager",
	    "content": "SMB LAN Manager versions.",
	},
	"smb.os": {
	    "title": "<b>(!)</b>smb.os",
	    "content": "OS versions according to the SMB service.",
	},
	"smb.smb-version": {
	    "title": "<b>(!)</b>smb.smb-version",
	    "content": "SMB versions.",
	},
	"ntlm.domain_dns": {
	    "title": "<b>(!)</b>ntlm.domain_dns",
	    "content": "NTLM domains (DNS).",
	},
	"ntlm.domain": {
	    "title": "<b>(!)</b>ntlm.domain",
	    "content": "NTLM domains.",
	},
	"ntlm.forest_dns": {
	    "title": "<b>(!)</b>ntlm.forest_dns",
	    "content": "NTLM forests.",
	},
	"ntlm.workgroup": {
	    "title": "<b>(!)</b>ntlm.workgroup",
	    "content": "NTLM workgroups.",
	},
	"ntlm.os": {
	    "title": "<b>(!)</b>ntlm.os",
	    "content": "OS versions according to the NTLM protocol.",
	},
	"ntlm.version": {
	    "title": "<b>(!)</b>ntlm.version",
	    "content": "NTLM versions.",
	},
	"domains": {
	    "title": "<b>(!)</b>domains<b>(:[domain])(:[level])</b>:",
	    "content": "DNS domains (optionally limited to the specified domain and/or the specific level).",
	},
	"file.filename": {
	    "title": "<b>(!)</b>file<b>(:[script id](,[script id](,[...])))</b> or <b>(!)</b>file.filename<b>([...])</b>",
	    "content": "Filenames from shared folders (AFP, SMB, NFS)."
	},
	"file.time": {
	    "title": "<b>(!)</b>file.time<b>(:[script id](,[script id](,[...])))</b>",
	    "content": "Timestamps from shared folders (AFP, SMB, NFS)."
	},
	"file.size": {
	    "title": "<b>(!)</b>file.size<b>(:[script id](,[script id](,[...])))</b>",
	    "content": "File sizes from shared folders (AFP, SMB, NFS)."
	},
	"file.uid": {
	    "title": "<b>(!)</b>file.uid<b>(:[script id](,[script id](,[...])))</b>",
	    "content": "File owners UID from shared folders (AFP, SMB, NFS)."
	},
	"file.gid": {
	    "title": "<b>(!)</b>file.gid<b>(:[script id](,[script id](,[...])))</b>",
	    "content": "File owners GID from shared folders (AFP, SMB, NFS)."
	},
	"file.permission": {
	    "title": "<b>(!)</b>file.permission<b>(:[script id](,[script id](,[...])))</b>",
	    "content": "File permissions from shared folders (AFP, SMB, NFS)."
	},
	"portlist:open": {
	    "content": "portlist:open",
	    "title": "<b>(!)</b>portlist:open"
	},
	"service:": {
	    "content": "service:",
	    "title": "<b>(!)</b>service:"
	},
	"as": {
	    "content": "as",
	    "title": "<b>(!)</b>as"
	},
	"modbus.deviceid": {
	    "content": "modbus.deviceid",
	    "title": "<b>(!)</b>modbus.deviceid"
	},
	"enip.ip": {
	    "content": "enip.ip",
	    "title": "<b>(!)</b>enip.ip"
	},
	"mongo.dbs.databases.name": {
	    "content": "mongo.dbs.databases.name",
	    "title": "<b>(!)</b>mongo.dbs.databases.name"
	},
	"vulns.id": {
	    "content": "vulns.id",
	    "title": "<b>(!)</b>vulns.id"
	},
	"vulns.title": {
	    "content": "vulns.title",
	    "title": "<b>(!)</b>vulns.title"
	},
	"vulns.state": {
	    "content": "vulns.state",
	    "title": "<b>(!)</b>vulns.state"
	},
	"vulns.refs": {
	    "content": "vulns.refs",
	    "title": "<b>(!)</b>vulns.refs"
	},
	"vulns.extra_info": {
	    "content": "vulns.extra_info",
	    "title": "<b>(!)</b>vulns.extra_info"
	},
	"countports:closed": {
	    "content": "countports:closed",
	    "title": "<b>(!)</b>countports:closed"
	},
	"port": {
	    "content": "port",
	    "title": "<b>(!)</b>port"
	},
	"script:": {
	    "content": "script:",
	    "title": "<b>(!)</b>script:"
	},
	"category": {
	    "content": "category(:[pattern])",
	    "title": "<b>(!)</b>category"
	},
	"city": {
	    "content": "city",
	    "title": "<b>(!)</b>city"
	},
	"net": {
	    "content": "net(:mask)",
	    "title": "<b>(!)</b>net:",
	},
	"scanner.name": {
	    "content": "scanner.name",
	    "title": "<b>(!)</b>scanner.name",
	},
	"scanner.port:tcp": {
	    "content": "scanner.port:tcp",
	    "title": "<b>(!)</b>scanner.port:tcp",
	},
	"scanner.port:udp": {
	    "content": "scanner.port:udp",
	    "title": "<b>(!)</b>scanner.port:udp",
	},
	"screenwords": {
	    "content": "screenwords",
	    "title": "<b>(!)</b>screenwords"
	},
	"service": {
	    "content": "service",
	    "title": "<b>(!)</b>service"
	},
	"script": {
	    "content": "script",
	    "title": "<b>(!)</b>script"
	},
	"devicetype:": {
	    "content": "devicetype:",
	    "title": "<b>(!)</b>devicetype:"
	},
	"version:": {
	    "content": "version:",
	    "title": "<b>(!)</b>version:"
	},
	"source": {
	    "content": "source",
	    "title": "<b>(!)</b>source"
	},
	"s7.module": {
	    "content": "s7.module",
	    "title": "<b>(!)</b>s7.module"
	},
	"s7.version": {
	    "content": "s7.version",
	    "title": "<b>(!)</b>s7.version"
	},
	"s7.system_name": {
	    "content": "s7.system_name",
	    "title": "<b>(!)</b>s7.system_name"
	},
	"s7.module_name": {
	    "content": "s7.module_name",
	    "title": "<b>(!)</b>s7.module_name"
	},
	"s7.plant": {
	    "content": "s7.plant",
	    "title": "<b>(!)</b>s7.plant"
	},
	"s7.copyright": {
	    "content": "s7.copyright",
	    "title": "<b>(!)</b>s7.copyright"
	},
	"version": {
	    "content": "version",
	    "title": "<b>(!)</b>version"
	},
	"portlist:filtered": {
	    "content": "portlist:filtered",
	    "title": "<b>(!)</b>portlist:filtered"
	},
	"hop": {
	    "content": "hop",
	    "title": "<b>(!)</b>hop"
	},
	"product:": {
	    "content": "product:",
	    "title": "<b>(!)</b>product:"
	},
	"countports:open": {
	    "content": "countports:open",
	    "title": "<b>(!)</b>countports:open"
	},
	"product": {
	    "content": "product",
	    "title": "<b>(!)</b>product"
	},
	"countports:filtered": {
	    "content": "countports:filtered",
	    "title": "<b>(!)</b>countports:filtered"
	},
	"cert.subject": {
	    "content": "cert.subject",
	    "title": "<b>(!)</b>cert.subject"
	},
	"cert.issuer": {
	    "content": "cert.issuer",
	    "title": "<b>(!)</b>cert.issuer"
	},
	"cert.md5": {
	    "content": "cert.md5",
	    "title": "<b>(!)</b>cert.md5"
	},
	"cert.sha1": {
	    "content": "cert.sha1",
	    "title": "<b>(!)</b>cert.sha1"
	},
	"cert.sha256": {
	    "content": "cert.sha256",
	    "title": "<b>(!)</b>cert.sha256"
	},
	"sshkey.type": {
	    "title": "<b>(!)</b>sshkey.type",
	    "content": "Most common SSH host key types."
	},
	"sshkey.bits": {
	    "title": "<b>(!)</b>sshkey.bits",
	    "content": "Most common SSH host key lengths."
	},
	"sshkey.fingerprint": {
	    "title": "<b>(!)</b>sshkey.fingerprint",
	    "content": "Most common SSH host key fingerprints."
	},
	"enip.prodcode": {
	    "content": "enip.prodcode",
	    "title": "<b>(!)</b>enip.prodcode"
	},
	"enip.rev": {
	    "content": "enip.rev",
	    "title": "<b>(!)</b>enip.rev"
	},
	"devicetype": {
	    "content": "devicetype",
	    "title": "<b>(!)</b>devicetype"
	},
	"port:open": {
	    "content": "port:open",
	    "title": "<b>(!)</b>port:open"
	},
	"enip.devtype": {
	    "content": "enip.devtype",
	    "title": "<b>(!)</b>enip.devtype"
	},
	"hop:": {
	    "content": "hop:",
	    "title": "<b>(!)</b>hop:"
	},
	"enip.product": {
	    "content": "enip.product",
	    "title": "<b>(!)</b>enip.product"
	},
	"enip.vendor": {
	    "content": "enip.vendor",
	    "title": "<b>(!)</b>enip.vendor"
	},
	"port:closed": {
	    "content": "port:closed",
	    "title": "<b>(!)</b>port:closed"
	},
	"country": {
	    "content": "country",
	    "title": "<b>(!)</b>country"
	},
	"port:filtered": {
	    "content": "port:filtered",
	    "title": "<b>(!)</b>port:filtered"
	},
	"portlist:closed": {
	    "content": "portlist:closed",
	    "title": "<b>(!)</b>portlist:closed"
	},
	"enip.serial": {
	    "content": "enip.serial",
	    "title": "<b>(!)</b>enip.serial"
	},
	"ike.notification": {
	    "content": "ike.notification",
	    "title": "<b>(!)</b>ike.notification"
	},
	"ike.transforms": {
	    "content": "ike.transforms",
	    "title": "<b>(!)</b>ike.transforms"
	},
	"ike.transforms.Authentication": {
	    "content": "ike.transforms.Authentication",
	    "title": "<b>(!)</b>ike.transforms.Authentication"
	},
	"ike.transforms.Encryption": {
	    "content": "ike.transforms.Encryption",
	    "title": "<b>(!)</b>ike.transforms.Encryption"
	},
	"ike.transforms.GroupDesc": {
	    "content": "ike.transforms.GroupDesc",
	    "title": "<b>(!)</b>ike.transforms.GroupDesc"
	},
	"ike.transforms.Hash": {
	    "content": "ike.transforms.Hash",
	    "title": "<b>(!)</b>ike.transforms.Hash"
	},
	"ike.transforms.LifeDuration": {
	    "content": "ike.transforms.LifeDuration",
	    "title": "<b>(!)</b>ike.transforms.LifeDuration"
	},
	"ike.transforms.LifeType": {
	    "content": "ike.transforms.LifeType",
	    "title": "<b>(!)</b>ike.transforms.LifeType"
	},
	"ike.vendor_ids": {
	    "content": "ike.vendor_ids",
	    "title": "<b>(!)</b>ike.vendor_ids"
	},
	"ike.vendor_ids.name": {
	    "content": "ike.vendor_ids.name",
	    "title": "<b>(!)</b>ike.vendor_ids.name"
	},
	"ike.vendor_ids.value": {
	    "content": "ike.vendor_ids.value",
	    "title": "<b>(!)</b>ike.vendor_ids.value"
	},
	"httphdr": {
	    "title": "httphdr<b>(:[name])</b>",
	    "content": "Top HTTP header values seen",
	},
	"httphdr.name": {
	    "title": "httphdr.name",
	    "content": "Top HTTP headers used",
	},
	"httphdr.value": {
	    "title": "httphdr.value",
	    "content": "Top HTTP header values seen, regardless of the header name",
	},
	"httpapp": {
	    "title": "httpapp<b>(:[name])</b>",
	    "content": "Top HTTP applications (and versions) seen",
	},
	"useragent": {
	    "title": "<b>(!)</b>useragent<b>(:[value])</b>",
	    "content": "Top HTTP User-Agent values seen."
	},
	"ja3-client": {
	    "title": "<b>(!)</b>ja3-client<b>(:[value])</b>",
	    "content": "Top JA3 client values (MD5)."
	},
	"ja3-client.md5": {
	    "title": "<b>(!)</b>ja3-client.md5<b>(:[value])</b>",
	    "content": "Top JA3 client values (MD5)."
	},
	"ja3-client.sha1": {
	    "title": "<b>(!)</b>ja3-client.sha1<b>(:[value])</b>",
	    "content": "Top JA3 client values (SHA1)."
	},
	"ja3-client.sha256": {
	    "title": "<b>(!)</b>ja3-client.sha256<b>(:[value])</b>",
	    "content": "Top JA3 client values (SHA256)."
	},
	"ja3-client.raw": {
	    "title": "<b>(!)</b>ja3-client.raw<b>(:[value])</b>",
	    "content": "Top JA3 client values (raw fingerprint)."
	},
	"hassh": {
	    "title": "<b>(!)</b>hassh",
	    "content": "Top HASSH values (MD5)",
	},
	"hassh.md5": {
	    "title": "<b>(!)</b>hassh.md5",
	    "content": "Top HASSH values (MD5)",
	},
	"hassh.sha1": {
	    "title": "<b>(!)</b>hassh.sha1",
	    "content": "Top HASSH values (SHA1)",
	},
	"hassh.sha256": {
	    "title": "<b>(!)</b>hassh.sha256",
	    "content": "Top HASSH values (SHA256)",
	},
	"hassh.raw": {
	    "title": "<b>(!)</b>hassh.raw",
	    "content": "Top HASSH values (RAW)",
	},
	"hassh-client": {
	    "title": "<b>(!)</b>hassh-client",
	    "content": "Top HASSH client values (MD5)",
	},
	"hassh-client.md5": {
	    "title": "<b>(!)</b>hassh-client.md5",
	    "content": "Top HASSH client values (MD5)",
	},
	"hassh-client.sha1": {
	    "title": "<b>(!)</b>hassh-client.sha1",
	    "content": "Top HASSH client values (SHA1)",
	},
	"hassh-client.sha256": {
	    "title": "<b>(!)</b>hassh-client.sha256",
	    "content": "Top HASSH client values (SHA256)",
	},
	"hassh-client.raw": {
	    "title": "<b>(!)</b>hassh-client.raw",
	    "content": "Top HASSH client values (RAW)",
	},
	"hassh-server": {
	    "title": "<b>(!)</b>hassh-server",
	    "content": "Top HASSH server values (MD5)",
	},
	"hassh-server.md5": {
	    "title": "<b>(!)</b>hassh-server.md5",
	    "content": "Top HASSH server values (MD5)",
	},
	"hassh-server.sha1": {
	    "title": "<b>(!)</b>hassh-server.sha1",
	    "content": "Top HASSH server values (SHA1)",
	},
	"hassh-server.sha256": {
	    "title": "<b>(!)</b>hassh-server.sha256",
	    "content": "Top HASSH server values (SHA256)",
	},
	"hassh-server.raw": {
	    "title": "<b>(!)</b>hassh-server.raw",
	    "content": "Top HASSH server values (RAW)",
	},
    }
};

prepare(HELP_TOPVALUES);

/************* Menu content ****************/

/* Menus structure is as follows:
 *
 * - items: menu content, see below
 * - share (optional): if set to true, add a 'Share' menu.
 * - share_report (optional): if set to true, include a 'Report' item
 *   in the 'Share' menu.
 * - share_htmlexport (optional): if set to true, include an 'HTML
 *    export' item in the 'Share' menu.
 *
 * The menu content is a list of recursive 'items'.
 *
 * items:
 * - title: printed string
 * - action: (optional) javascript to execute on click
 * - icon: (optional) associated glyphicon
 * - items: (recursive) sub-menu
 *
 * If there is only one level of item, the menu is displayed as '.menu-single';
 * otherwise, a Bootstrap dropdown is used.
 *
 * The second layer of recursivity is displayed thanks to right chevron.
 *
 * Only three level of menu is currently supported.
 */

var _SUBMENU_FILTERS = [
    {title: "Unix",
     icon: "heart",
     items: [
	 {title: "NFS",
	  action: "$scope.setparam('nfs', undefined, true, true); $scope.setparam('display', 'script:rpcinfo,nfs-showmount,nfs-ls', true);",
	 },
	 {title: "NIS / YP",
	  action: "$scope.setparam('nis')",
	 },
	 {title: "X11",
	  action: "$scope.setparam('x11srv');",
	  items: [
	      {title: "open",
	       action: "$scope.setparam('x11open');",
	      }
	  ],
	 },
     ],
    },
    {title: "Win",
     icon: "th-large",
     items: [
	 {title: "XP / 445",
	  action: "$scope.setparam('xp445');",
	 },
	 {title: "SMB shares",
	  action: "$scope.setparam('smbshare', undefined, true, true); $scope.setparam('display', 'script:smb-enum-shares,smb-ls', true);",
	  items: [
	      {title: "writable",
	       action: "$scope.setparam('smbshare', 'w', true, true); $scope.setparam('display', 'script:smb-enum-shares,smb-ls', true);"
	      },
	  ],
	 },
	 {title: "MS-SQL empty password",
	  action: "$scope.setparam('mssqlemptypwd');"
	 },
     ],
    },
    {title: "Web",
     icon: "globe",
     items: [
	 {title: "HTTP Auth",
	  action: "$scope.setparam('authhttp');",
	 },
	 {title: "Shared web files",
	  action: "$scope.setparam('webfiles', undefined, true, true); $scope.setparam('display', 'script:ls', true);",
	 },
	 {title: "Git repository",
	  action: "$scope.setparam('script', 'http-git:\"/Git repository found/\"');",
	 },
	 {title: "OWA",
	  action: "$scope.setparam('owa');",
	 },
	 {title: "PHPMyAdmin",
	  action: "$scope.setparam('phpmyadmin');",
	 }
     ],
    },
    {title: "Auth",
     icon: "lock",
     items: [
	 {title: "HTTP Auth",
	  action: "$scope.setparam('authhttp');",
	 },
	 {title: "Anonymous FTP",
	  action: "$scope.setparam('anonftp', undefined, true, true); $scope.setparam('display', 'script:ftp-anon', true);",
	 },
	 {title: "Anonymous LDAP",
	  action: "$scope.setparam('anonldap')",
	 },
	 {title: "NIS / YP",
	  action: "$scope.setparam('nis')",
	 },
	 {title: "VNC Authentication Bypass",
	  action: "$scope.setparam('authbypassvnc');",
	 },
	 {title: "MS-SQL empty password",
	  action: "$scope.setparam('mssqlemptypwd')",
	 },
	 {title: "MY-SQL empty password",
	  action: "$scope.setparam('mysqlemptypwd')",
	 },
     ],
    },
    {title: "Relay",
     icon: "share-alt",
     items: [
	 {title: "HTTP Open Proxy",
	  action: "$scope.setparam('script', 'http-open-proxy');",
	 },
	 {title: "Socks Open Proxy",
	  action: "$scope.setparam('script', 'socks-open-proxy');",
	 },
	 {title: "SMTP Open Relay",
	  action: "$scope.setparam('script', 'smtp-open-relay');",
	 },
	 {title: "FTP Bounce",
	  action: "$scope.setparam('script', 'ftp-bounce:bounce working!');",
	 },
     ],
    },
    {title: "Fun",
     icon: "screenshot",
     items: [
	 {title: "Webcam",
	  action: "$scope.setparam('devicetype', 'webcam');",
	  items: [
	      {title: "GeoVision",
	       action: "$scope.setparam('geovision');",
	      },
	  ],
	 },
	 {title: "Network devices",
	  action: "$scope.setparam('netdev');",
	 },
	 {title: "Telephony devices",
	  action: "$scope.setparam('phonedev');",
	 },
	 {title: "Screenshots",
	  action: "$scope.setparam('screenshot', undefined, true, true); $scope.setparam('display', 'screenshot', true);",
	 },
	 {title: "Shared files",
	  action: "$scope.setparam('file', undefined, true, true); $scope.setparam('display', 'script:ls', true);",
	 },
     ],
    },
];

var _SUBMENU_SORT = [
	{title: "Sort",
	 icon: "random",
	 items: [
	     {title: "Date of scan",
	      action: "$scope.setparam('sortby', 'endtime', true);",
	      icon: "arrow-down",
	     },
	     {title: "Date of scan",
	      action: "$scope.setparam('-sortby', 'endtime', true);",
	      icon: "arrow-up",
	     },
	     {title: "IP Address",
	      action: "$scope.setparam('sortby', 'addr', true);",
	      icon: "arrow-down",
	     },
	     {title: "IP Address",
	      action: "$scope.setparam('-sortby', 'addr', true);",
	      icon: "arrow-up",
	     },
	     {title: "Open ports",
	      action: "$scope.setparam('sortby', 'openports.count', true);",
	      icon: "arrow-down",
	     },
	     {title: "Open ports",
	      action: "$scope.setparam('-sortby', 'openports.count', true);",
	      icon: "arrow-up",
	     },
	 ],
	},
];

// Menu for index.html
var MENU_MAIN = {
    share: true,
    share_report: true,
    share_compare: true,
    share_jsonexport: true,
    share_addrlist: true,
    items: [
	{title: "HELP",
	 action: "$scope.togglenotes('doc/usage/web-ui.html');",
	 icon: "question-sign",
	},
	{title: "Flow",
	 action: "document.location = 'flow.html'",
	 icon: "transfer",
	},
    ]
};

$.merge(MENU_MAIN.items, _SUBMENU_FILTERS);
$.merge(MENU_MAIN.items, _SUBMENU_SORT);

// Handle 'Upload' option
if (config.uploadok) {
    MENU_MAIN.items.push({title: "Upload",
			  action: "document.location = 'upload.html'",
			  icon: "upload"
			 });
}

// Menu for compare.html
var MENU_COMPARE = {
    share: true,
    share_report: true,
    items: [
	{title: "Main",
	 action: "document.location = $scope.get_href('index.html')",
	 icon: "home",
	},
    ]
};

$.merge(MENU_COMPARE.items, _SUBMENU_FILTERS);

// Menu for report.html
var MENU_REPORT = {
    share: true,
    share_htmlexport: true,
    share_compare: true,
    items: [
	{title: "Main",
	 action: "document.location = $scope.get_href('index.html')",
	 icon: "home",
	},
	{title: "Config",
	 action: "$scope.toggleShowFilter();",
	 icon: "list",
	},
	{title: "Build",
	 action: "$scope.build_all();",
	 icon: "ok",
	},
    ]
};


// Menu for flow.html
var MENU_FLOW = {
  share: true,
  share_htmlexport: false,
  share_compare: false,
  items: [
  {title: "Main",
    action: "document.location = $scope.get_href('index.html', true)",
    icon: "home",
  },
  ]
};

// Export menus
var MENUS = {
    main: MENU_MAIN,
    report: MENU_REPORT,
    compare: MENU_COMPARE,
    flow: MENU_FLOW,
};
