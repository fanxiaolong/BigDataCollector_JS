/**
 * Created by fanxiaolong on 2016/4/22.
 */

var GetVideoInfo = function (options) {
    options || (options = {});
    this.extend(this, options);
    if (!window.PAGE_START_TIME) {
        throw new Error('请先在页面顶部复制以下代码：window.PAGE_START_TIME = new Date().getTime();');
    }
    this.pageStartTime = window.PAGE_START_TIME;   //页面开始时间戳
    this.initialize.apply(this);   //初始化操作
};

GetVideoInfo.prototype = {
    constructor: GetVideoInfo,
    version: '1.0.1',
    videoObject: '',  //视频jquery对象,现在只能统计页面上一个视频的数据
    models: {},
    sendNumbers: 0,   //发送序号
    stickTimes: 0,  //卡顿次数
    lastPlayTime: 0, //上次播放时间位置
    totalStickDuration: 0,  //在轮询时长周期内的总卡顿时长
    videoLoadTime: 0, //页面加载时长
    polling: false,  //是否轮询
    pollingTimes: 60, //轮询时长
    url: 'http://tracker.otvcloud.com/t.gif',  //服务器地址
    interval: 1,
    regexes: {
        device_parsers: [{
            regex: "HTC ([A-Z][a-z0-9]+) Build",
            device_replacement: "HTC $1",
            manufacturer: "HTC"
        }, {
            regex: "HTC ([A-Z][a-z0-9 ]+) \\d+\\.\\d+\\.\\d+\\.\\d+",
            device_replacement: "HTC $1",
            manufacturer: "HTC"
        }, {
            regex: "HTC_Touch_([A-Za-z0-9]+)",
            device_replacement: "HTC Touch ($1)",
            manufacturer: "HTC"
        }, {
            regex: "USCCHTC(\\d+)",
            device_replacement: "HTC $1 (US Cellular)",
            manufacturer: "HTC"
        }, {
            regex: "Sprint APA(9292)",
            device_replacement: "HTC $1 (Sprint)",
            manufacturer: "HTC"
        }, {
            regex: "HTC ([A-Za-z0-9]+ [A-Z])",
            device_replacement: "HTC $1",
            manufacturer: "HTC"
        }, {
            regex: "HTC-([A-Za-z0-9]+)",
            device_replacement: "HTC $1",
            manufacturer: "HTC"
        }, {
            regex: "HTC_([A-Za-z0-9]+)",
            device_replacement: "HTC $1",
            manufacturer: "HTC"
        }, {
            regex: "HTC ([A-Za-z0-9]+)",
            device_replacement: "HTC $1",
            manufacturer: "HTC"
        }, {
            regex: "(ADR[A-Za-z0-9]+)",
            device_replacement: "HTC $1",
            manufacturer: "HTC"
        }, {
            regex: "(HTC)",
            manufacturer: "HTC"
        }, {
            regex: "SonyEricsson([A-Za-z0-9]+)/",
            device_replacement: "Ericsson $1",
            other: true,
            manufacturer: "Sony"
        }, {
            regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; WOWMobile (.+) Build"
        }, {
            regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
        }, {
            regex: "Android[\\- ][\\d]+\\.[\\d]+\\-update1\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
        }, {
            regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
        }, {
            regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; (.+) Build"
        }, {
            regex: "NokiaN([0-9]+)",
            device_replacement: "Nokia N$1",
            manufacturer: "Nokia"
        }, {
            regex: "Nokia([A-Za-z0-9\\v-]+)",
            device_replacement: "Nokia $1",
            manufacturer: "Nokia"
        }, {
            regex: "NOKIA ([A-Za-z0-9\\-]+)",
            device_replacement: "Nokia $1",
            manufacturer: "Nokia"
        }, {
            regex: "Nokia ([A-Za-z0-9\\-]+)",
            device_replacement: "Nokia $1",
            manufacturer: "Nokia"
        }, {
            regex: "Lumia ([A-Za-z0-9\\-]+)",
            device_replacement: "Lumia $1",
            manufacturer: "Nokia"
        }, {
            regex: "Symbian",
            device_replacement: "Nokia",
            manufacturer: "Nokia"
        }, {
            regex: "(PlayBook).+RIM Tablet OS",
            device_replacement: "Blackberry Playbook",
            tablet: true,
            manufacturer: "RIM"
        }, {
            regex: "(Black[Bb]erry [0-9]+);",
            manufacturer: "RIM"
        }, {
            regex: "Black[Bb]erry([0-9]+)",
            device_replacement: "BlackBerry $1",
            manufacturer: "RIM"
        }, {
            regex: "(Pre)/(\\d+)\\.(\\d+)",
            device_replacement: "Palm Pre",
            manufacturer: "Palm"
        }, {
            regex: "(Pixi)/(\\d+)\\.(\\d+)",
            device_replacement: "Palm Pixi",
            manufacturer: "Palm"
        }, {
            regex: "(Touchpad)/(\\d+)\\.(\\d+)",
            device_replacement: "HP Touchpad",
            manufacturer: "HP"
        }, {
            regex: "HPiPAQ([A-Za-z0-9]+)/(\\d+).(\\d+)",
            device_replacement: "HP iPAQ $1",
            manufacturer: "HP"
        }, {
            regex: "Palm([A-Za-z0-9]+)",
            device_replacement: "Palm $1",
            manufacturer: "Palm"
        }, {
            regex: "Treo([A-Za-z0-9]+)",
            device_replacement: "Palm Treo $1",
            manufacturer: "Palm"
        }, {
            regex: "webOS.*(P160UNA)/(\\d+).(\\d+)",
            device_replacement: "HP Veer",
            manufacturer: "HP"
        }, {
            regex: "(Kindle Fire)",
            manufacturer: "Amazon"
        }, {
            regex: "(Kindle)",
            manufacturer: "Amazon"
        }, {
            regex: "(Silk)/(\\d+)\\.(\\d+)(?:\\.([0-9\\-]+))?",
            device_replacement: "Kindle Fire",
            tablet: true,
            manufacturer: "Amazon"
        }, {
            regex: "(iPad) Simulator;",
            manufacturer: "Apple"
        }, {
            regex: "(iPad);",
            manufacturer: "Apple"
        }, {
            regex: "(iPod);",
            manufacturer: "Apple"
        }, {
            regex: "(iPhone) Simulator;",
            manufacturer: "Apple"
        }, {
            regex: "(iPhone);",
            manufacturer: "Apple"
        }, {
            regex: "Nexus\\ ([A-Za-z0-9\\-]+)",
            device_replacement: "Nexus $1"
        }, {
            regex: "acer_([A-Za-z0-9]+)_",
            device_replacement: "Acer $1",
            manufacturer: "Acer"
        }, {
            regex: "acer_([A-Za-z0-9]+)_",
            device_replacement: "Acer $1",
            manufacturer: "Acer"
        }, {
            regex: "Amoi\\-([A-Za-z0-9]+)",
            device_replacement: "Amoi $1",
            other: true,
            manufacturer: "Amoi"
        }, {
            regex: "AMOI\\-([A-Za-z0-9]+)",
            device_replacement: "Amoi $1",
            other: true,
            manufacturer: "Amoi"
        }, {
            regex: "Asus\\-([A-Za-z0-9]+)",
            device_replacement: "Asus $1",
            manufacturer: "Asus"
        }, {
            regex: "ASUS\\-([A-Za-z0-9]+)",
            device_replacement: "Asus $1",
            manufacturer: "Asus"
        }, {
            regex: "BIRD\\-([A-Za-z0-9]+)",
            device_replacement: "Bird $1",
            other: true
        }, {
            regex: "BIRD\\.([A-Za-z0-9]+)",
            device_replacement: "Bird $1",
            other: true
        }, {
            regex: "BIRD ([A-Za-z0-9]+)",
            device_replacement: "Bird $1",
            other: true
        }, {
            regex: "Dell ([A-Za-z0-9]+)",
            device_replacement: "Dell $1",
            manufacturer: "Dell"
        }, {
            regex: "DoCoMo/2\\.0 ([A-Za-z0-9]+)",
            device_replacement: "DoCoMo $1",
            other: true
        }, {
            regex: "([A-Za-z0-9]+)\\_W\\;FOMA",
            device_replacement: "DoCoMo $1",
            other: true
        }, {
            regex: "([A-Za-z0-9]+)\\;FOMA",
            device_replacement: "DoCoMo $1",
            other: true
        }, {
            regex: "vodafone([A-Za-z0-9]+)",
            device_replacement: "Huawei Vodafone $1",
            other: true
        }, {
            regex: "i\\-mate ([A-Za-z0-9]+)",
            device_replacement: "i-mate $1",
            other: true
        }, {
            regex: "Kyocera\\-([A-Za-z0-9]+)",
            device_replacement: "Kyocera $1",
            other: true
        }, {
            regex: "KWC\\-([A-Za-z0-9]+)",
            device_replacement: "Kyocera $1",
            other: true
        }, {
            regex: "Lenovo\\-([A-Za-z0-9]+)",
            device_replacement: "Lenovo $1",
            manufacturer: "Lenovo"
        }, {
            regex: "Lenovo\\_([A-Za-z0-9]+)",
            device_replacement: "Lenovo $1",
            manufacturer: "Levovo"
        }, {
            regex: "LG/([A-Za-z0-9]+)",
            device_replacement: "LG $1",
            manufacturer: "LG"
        }, {
            regex: "LG-LG([A-Za-z0-9]+)",
            device_replacement: "LG $1",
            manufacturer: "LG"
        }, {
            regex: "LGE-LG([A-Za-z0-9]+)",
            device_replacement: "LG $1",
            manufacturer: "LG"
        }, {
            regex: "LGE VX([A-Za-z0-9]+)",
            device_replacement: "LG $1",
            manufacturer: "LG"
        }, {
            regex: "LG ([A-Za-z0-9]+)",
            device_replacement: "LG $1",
            manufacturer: "LG"
        }, {
            regex: "LGE LG\\-AX([A-Za-z0-9]+)",
            device_replacement: "LG $1",
            manufacturer: "LG"
        }, {
            regex: "LG\\-([A-Za-z0-9]+)",
            device_replacement: "LG $1",
            manufacturer: "LG"
        }, {
            regex: "LGE\\-([A-Za-z0-9]+)",
            device_replacement: "LG $1",
            manufacturer: "LG"
        }, {
            regex: "LG([A-Za-z0-9]+)",
            device_replacement: "LG $1",
            manufacturer: "LG"
        }, {
            regex: "(KIN)\\.One (\\d+)\\.(\\d+)",
            device_replacement: "Microsoft $1"
        }, {
            regex: "(KIN)\\.Two (\\d+)\\.(\\d+)",
            device_replacement: "Microsoft $1"
        }, {
            regex: "(Motorola)\\-([A-Za-z0-9]+)",
            manufacturer: "Motorola"
        }, {
            regex: "MOTO\\-([A-Za-z0-9]+)",
            device_replacement: "Motorola $1",
            manufacturer: "Motorola"
        }, {
            regex: "MOT\\-([A-Za-z0-9]+)",
            device_replacement: "Motorola $1",
            manufacturer: "Motorola"
        }, {
            regex: "Philips([A-Za-z0-9]+)",
            device_replacement: "Philips $1",
            manufacturer: "Philips"
        }, {
            regex: "Philips ([A-Za-z0-9]+)",
            device_replacement: "Philips $1",
            manufacturer: "Philips"
        }, {
            regex: "SAMSUNG-([A-Za-z0-9\\-]+)",
            device_replacement: "Samsung $1",
            manufacturer: "Samsung"
        }, {
            regex: "SAMSUNG\\; ([A-Za-z0-9\\-]+)",
            device_replacement: "Samsung $1",
            manufacturer: "Samsung"
        }, {
            regex: "Softbank/1\\.0/([A-Za-z0-9]+)",
            device_replacement: "Softbank $1",
            other: true
        }, {
            regex: "Softbank/2\\.0/([A-Za-z0-9]+)",
            device_replacement: "Softbank $1",
            other: true
        }, {
            regex: "(hiptop|avantgo|plucker|xiino|blazer|elaine|up.browser|up.link|mmp|smartphone|midp|wap|vodafone|o2|pocket|mobile|pda)",
            device_replacement: "Generic Smartphone"
        }, {
            regex: "^(1207|3gso|4thp|501i|502i|503i|504i|505i|506i|6310|6590|770s|802s|a wa|acer|acs\\-|airn|alav|asus|attw|au\\-m|aur |aus |abac|acoo|aiko|alco|alca|amoi|anex|anny|anyw|aptu|arch|argo|bell|bird|bw\\-n|bw\\-u|beck|benq|bilb|blac|c55/|cdm\\-|chtm|capi|comp|cond|craw|dall|dbte|dc\\-s|dica|ds\\-d|ds12|dait|devi|dmob|doco|dopo|el49|erk0|esl8|ez40|ez60|ez70|ezos|ezze|elai|emul|eric|ezwa|fake|fly\\-|fly\\_|g\\-mo|g1 u|g560|gf\\-5|grun|gene|go.w|good|grad|hcit|hd\\-m|hd\\-p|hd\\-t|hei\\-|hp i|hpip|hs\\-c|htc |htc\\-|htca|htcg)",
            device_replacement: "Generic Feature Phone"
        }, {
            regex: "^(htcp|htcs|htct|htc\\_|haie|hita|huaw|hutc|i\\-20|i\\-go|i\\-ma|i230|iac|iac\\-|iac/|ig01|im1k|inno|iris|jata|java|kddi|kgt|kgt/|kpt |kwc\\-|klon|lexi|lg g|lg\\-a|lg\\-b|lg\\-c|lg\\-d|lg\\-f|lg\\-g|lg\\-k|lg\\-l|lg\\-m|lg\\-o|lg\\-p|lg\\-s|lg\\-t|lg\\-u|lg\\-w|lg/k|lg/l|lg/u|lg50|lg54|lge\\-|lge/|lynx|leno|m1\\-w|m3ga|m50/|maui|mc01|mc21|mcca|medi|meri|mio8|mioa|mo01|mo02|mode|modo|mot |mot\\-|mt50|mtp1|mtv |mate|maxo|merc|mits|mobi|motv|mozz|n100|n101|n102|n202|n203|n300|n302|n500|n502|n505|n700|n701|n710|nec\\-|nem\\-|newg|neon)",
            device_replacement: "Generic Feature Phone"
        }, {
            regex: "^(netf|noki|nzph|o2 x|o2\\-x|opwv|owg1|opti|oran|ot\\-s|p800|pand|pg\\-1|pg\\-2|pg\\-3|pg\\-6|pg\\-8|pg\\-c|pg13|phil|pn\\-2|pt\\-g|palm|pana|pire|pock|pose|psio|qa\\-a|qc\\-2|qc\\-3|qc\\-5|qc\\-7|qc07|qc12|qc21|qc32|qc60|qci\\-|qwap|qtek|r380|r600|raks|rim9|rove|s55/|sage|sams|sc01|sch\\-|scp\\-|sdk/|se47|sec\\-|sec0|sec1|semc|sgh\\-|shar|sie\\-|sk\\-0|sl45|slid|smb3|smt5|sp01|sph\\-|spv |spv\\-|sy01|samm|sany|sava|scoo|send|siem|smar|smit|soft|sony|t\\-mo|t218|t250|t600|t610|t618|tcl\\-|tdg\\-|telm|tim\\-|ts70|tsm\\-|tsm3|tsm5|tx\\-9|tagt)",
            device_replacement: "Generic Feature Phone"
        }, {
            regex: "^(talk|teli|topl|tosh|up.b|upg1|utst|v400|v750|veri|vk\\-v|vk40|vk50|vk52|vk53|vm40|vx98|virg|vite|voda|vulc|w3c |w3c\\-|wapj|wapp|wapu|wapm|wig |wapi|wapr|wapv|wapy|wapa|waps|wapt|winc|winw|wonu|x700|xda2|xdag|yas\\-|your|zte\\-|zeto|aste|audi|avan|blaz|brew|brvw|bumb|ccwa|cell|cldc|cmd\\-|dang|eml2|fetc|hipt|http|ibro|idea|ikom|ipaq|jbro|jemu|jigs|keji|kyoc|kyok|libw|m\\-cr|midp|mmef|moto|mwbp|mywa|newt|nok6|o2im|pant|pdxg|play|pluc|port|prox|rozo|sama|seri|smal|symb|treo|upsi|vx52|vx53|vx60|vx61|vx70|vx80|vx81|vx83|vx85|wap\\-|webc|whit|wmlb|xda\\-|xda\\_)",
            device_replacement: "Generic Feature Phone"
        }, {
            regex: "(bot|borg|google(^tv)|yahoo|slurp|msnbot|msrbot|openbot|archiver|netresearch|lycos|scooter|altavista|teoma|gigabot|baiduspider|blitzbot|oegp|charlotte|furlbot|http%20client|polybot|htdig|ichiro|mogimogi|larbin|pompos|scrubby|searchsight|seekbot|semanticdiscovery|silk|snappy|speedy|spider|voila|vortex|voyager|zao|zeal|fast\\-webcrawler|converacrawler|dataparksearch|findlinks)",
            device_replacement: "Spider"
        }]
    },
    isNewUser: function () {
        return !this.getCookie('uid');
    },
    initialize: function () {
        this.getVideo();
        this.userAgent();
        this.evenInitialize();
        this.settingVd(this.models.vd);

        //判断用户是否为新用户: 0是老用户，1是新用户
        if (this.isNewUser()) {
            this.uid = this.createUID(32);
            this.setCookie('uid', this.uid, 3650);
            this.models.nu = 1;
        } else {
            this.models.nu = 0;
        }
    },
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date(),
            expires;
        if (exdays == 'undefined') {
            expires = '';
        } else {
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            expires = "expires=" + d.toUTCString();
        }
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    clearCookie: function (name) {
        this.setCookie(name, "", -1);
    },
    createUID: function (num) {
        var g = "", i = num;
        while (i--) {
            g += Math.floor(Math.random() * 16.0).toString(16);
        }
        return g
    },
    getVideo: function () {
        //只获取页面上第一个视频
        this.videoObject = document.getElementsByTagName('video')[0];
    },
    getReferrer: function () {
        var ref = '';
        if (document.referrer.length > 0) {
            ref = document.referrer;
        }
        try {
            if (ref.length == 0 && opener.location.href.length > 0) {
                ref = opener.location.href;
            }
        } catch (e) {
        }
        return encodeURIComponent(ref);
    },
    getTitle: function () {
        return encodeURIComponent(document.getElementsByTagName('title')[0].innerHTML);
    },
    getCurrentURL: function () {
        return encodeURIComponent(window.location.hostname + window.location.pathname);
    },
    getVideoURL: function () {
        return encodeURIComponent(this.videoObject.currentSrc);
    },
    getVideoDuration: function () {
        return Math.round(this.videoObject.duration) || 0;
    },
    addEvent: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        }
    },
    removeEvent: function (target, type, func) {
        if (target.removeEventListener) {
            target.removeEventListener(type, func, false);
        } else if (target.detachEvent) {
            target.detachEvent("on" + type, func);
        } else {
            target["on" + type] = null;
        }
    },
    evenInitialize: function () {
        var self = this;

        if (self.sendNumbers === 0) {
            self.addEvent(self.videoObject, 'timeupdate', self.calcLoadingTime.call(self));  //第一次开始播放的时候,证明缓冲已经完成
        } else {
            self.removeEvent(this.videoObject, 'timeupdate', self.calcLoadingTime);  //删除事件监听，节约内存
        }
        self.bindStickTimes();
    },
    calcLoadingTime: function () {
        this.videoLoadTime = Number(new Date().getTime()) - this.pageStartTime;
        this.startPolling(this.pollingTimes);
    },
    userAgent: function () {
        return this.ua = window.navigator.userAgent;
    },
    detectOS: function () {
        var ua = this.ua;
        switch (true) {
        case /Android/.test(ua):
            return "Android";
        case /iPhone|iPad|iPod/.test(ua):
            return "iOS";
        case /Windows/.test(ua):
            return "Windows";
        case /Mac OS X/.test(ua):
            return "Mac";
        case /CrOS/.test(ua):
            return "Chrome OS";
        case /Firefox/.test(ua):
            return "Firefox OS";
        }
        return "";
    },
    detectBrowser: function () {
        var ua = this.ua;
        switch (true) {
        case /CriOS/.test(ua):
            return "Chrome for iOS";
        case /Edge/.test(ua):
            return "Edge";
        case /Chrome/.test(ua):
            return "Chrome";
        case /Firefox/.test(ua):
            return "Firefox";
        case /Android/.test(ua):
            return "AOSP";
        case /MSIE|Trident/.test(ua):
            return "IE";
        case /Safari\//.test(ua):
            return "Safari";
        case /AppleWebKit/.test(ua):
            return "WebKit";
        }
        return "";
    },
    detectOSVersion: function () {
        var ua = this.ua;
        var os = this.detectOS();
        switch (os) {
        case "Android":
            return this._getVersion(ua, "Android");
        case "iOS":
            return this._getVersion(ua, /OS /);
        case "Windows":
            return this._getVersion(ua, /Phone/.test(ua) ? /Windows Phone (?:OS )?/ : /Windows NT/);
        case "Mac":
            return this._getVersion(ua, /Mac OS X /);
        }
        return "0.0.0";
    },
    detectDeviceName: function () {
        var ua = this.ua,
            ret = {},
            length = this.regexes.device_parsers.length;

        for (var i = 0; i < length; i++) {
            var obj = this.regexes.device_parsers[i],
                regexp = new RegExp(obj.regex), rep = obj.device_replacement, major_rep = obj.major_version_replacement,
                m = ua.match(regexp);

            if (!m) {
                continue;
            }
            ret.family = (rep ? rep.replace("$1", m[1]) : m[1]) || "other";
            break;
        }
        return ret.family || "other";
    },
    _getVersion: function (ua, token) {
        try {
            return this._normalizeSemverString(ua.split(token)[1].trim().split(/[^\w\.]/)[0]);
        } catch (o_O) {
            // ignore
        }
        return "0.0.0";
    },
    _normalizeSemverString: function (version) {
        var ary = version.split(/[\._]/); // "1_2_3" -> ["1", "2", "3"]
                                          // "1.2.3" -> ["1", "2", "3"]
        return ( parseInt(ary[0], 10) || 0 ) + "." +
            ( parseInt(ary[1], 10) || 0 ) + "." +
            ( parseInt(ary[2], 10) || 0 );
    },
    getVideoCurrentTime: function () {
        return Math.round(this.videoObject.currentTime);
    },
    calcVideoDiffTime: function (lastTime) {
        return (Math.round(this.videoObject.currentTime) - lastTime) > 0 ? (Math.round(this.videoObject.currentTime) - lastTime) : 0;
    },
    extend: function (destination, source) {
        for (property in source) {
            destination[property] = source[property];
        }
        return destination;
    },
    getTimeOnSite: function () {
        return Number(new Date().getTime()) - this.pageStartTime;
    },
    processData: function () {
        this.models.s = this.getCookie('sessionID');
        this.models.sn = this.sendNumbers;
        this.models.ref = this.getReferrer();  //ref: 来源（来自于来个页面）
        this.models.pu = this.getCurrentURL();  //pu：page url 页面url（当前页面url）
        this.models.vurl = this.getVideoURL();  //vurl:视频URL（被播放的视频的url地址
        this.models.t = this.getTitle();  //pt: page title,页面标题
        this.models.bs = this.detectBrowser();  //bs：浏览器类型（browserType）
        this.models.os = this.detectOSVersion();  //os：系统(系统版本)
        this.models.pf = this.detectOS();  // pf:播放平台（android，IOS，windows）
        this.models.at = this.detectDeviceName();  // at:机型
        this.models.dr = this.getVideoDuration(); //dr: 视频文件总时长(videoDuration)
        this.models.st = this.stickTimes;   //卡顿次数
        this.models.sd = this.totalStickDuration / 1000;  //卡顿时长
        this.models.lt = this.videoLoadTime / 1000;  //lt: 加载时长  单位秒（loaddingTime）
        this.models.stay = this.getTimeOnSite() / 1000;  //停留时长单位秒
        this.models.pt = this.getVideoCurrentTime();  //获取当前播放的时间点
        this.models.rpt = this.calcVideoDiffTime(this.lastPlayTime); //实际播放时长用这个字段
        this.models.uid = this.getCookie('uid');
        this.models.tpt = this.models.stay;
        this.models.ver = this.version;
        return this.models;
    },
    reset: function () {
        this.sendNumbers = 0;
    },
    bindStickTimes: function () {
        var self = this,
            stickStatus = false,
            waitingUnix = 0,
            playingUnix = 0;

        self.addEvent(self.videoObject, 'waiting', function () {
            self.stickTimes++;

            //如果是连续卡顿，则计算最早的一次卡顿的时间戳
            if (!stickStatus) {
                self.stickTimes++;
                waitingUnix = Number(new Date().getTime());
                stickStatus = true;
            }
        });

        self.addEvent(self.videoObject, 'canplay', function () {

            //如果当前播事件前面没有等待时间的时间戳
            if (waitingUnix !== 0) {
                playingUnix = Number(new Date().getTime());
                var currentStickDuration = playingUnix - waitingUnix;  //当前这次的卡顿时长
                if (currentStickDuration > 0) {

                    self.totalStickDuration = self.totalStickDuration + currentStickDuration;  //计算总的卡顿时长

                    //每次成功计算完当前卡顿时长后，重置状态，开始新一轮的卡顿时长计算
                    stickStatus = false;
                    waitingUnix = waitingUnix = 0;
                    // console.log('当前等待时长：',currentStickDuration/1000, 's;总共等待时长：',self.totalStickDuration/1000,'s');
                }
            }

        });
    },
    startPolling: function (interval) {
        this.polling = true;

        if (interval) {
            this.interval = interval;
        }

        this.executePolling();
    },
    stopPolling: function () {
        this.polling = false;
    },
    param: function (obj) {
        var prefix,
            s = [],
            add = function (key, value) {

                value = value == null ? "" : value;
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };

        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                add(prop, obj[prop]);
            }
        }

        return s.join("&").replace(/%20/g, "+");
    },
    settingVd: function (vd) {
        this.vd = vd;
    },
    isSwitchVideo: function () {
        var previous = this.vd;
        if (previous !== this.models.vd) {
            this.vd = this.models.vd;
            this.reset();
        }
    },
    isfirstVisit: true,
    executePolling: function () {
        /* 上传数据操作 */
        var img = new Image(),
            self = this,
            timeStamp = new Date().getTime(),
            data;

        if (self.isfirstVisit === true) {
            if (!(this.getCookie('uid').length === 32)) {
                this.setCookie('sessionID', this.createUID(32));
            }
            self.isfirstVisit = false;
        } else {
            this.isSwitchVideo();
        }

        data = self.processData();
        self.lastPlayTime = data.pt;
        data = this.param(data);
        img.src = self.url + '?_=' + timeStamp + '&' + data;

        img.onabort = function () {
            self.onCommit();
        };
        img.onerror = function () {
            self.onCommit();
        };
        img.onload = function () {
            self.sendNumbers++;
            self.onCommit();
        };
    },
    onCommit: function () {
        var self = this;

        //发送数据以后，重新计算卡顿时长、卡顿次数都重置为0
        self.totalStickDuration = 0;
        self.stickTimes = 0;

        setTimeout(function () {
            self.executePolling();
        }, 1000 * this.interval);
    }
};