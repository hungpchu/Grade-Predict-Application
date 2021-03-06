var mpwebgl, faceIndex = 1,
    hairIndex = 0,
    beardIndex = 0,
    glassesIndex = 0,
    voiceIndex = 0,
    cosmeLipIndex = 0, cosmeCheekIndex = 0, cosmeEyeIndex =0,
    animIndex = 0,
    expressionIndex = 0,
    loadingbar, inputbar, footer;
var beardId, hairId, glassesId;
function initEvt(){
    $( "#avatarChange" ).bind( "click", onAvatarChange);
    $( "#hairChange" ).bind( "click", onHairChange);
    $( "#hairClear" ).bind( "click", onhairclear);
    $( "#glassesChange" ).bind( "click", onGlassesChange);
    $( "#glassesClear" ).bind( "click", onglassessclear);
    $( "#beardChange" ).bind( "click", onBeardChange);
    $( "#beardClear" ).bind( "click", onbeardclear);
    $( "#cosmeLip" ).bind( "click", onCosmeLipChange);
    $( "#cosmeCheek" ).bind( "click", onCosmeCheekChange);
    $( "#cosmeEye" ).bind( "click", onCosmeEyeChange);
    $( "#cosmeClear" ).bind( "click", oncosmeclear);
    $( "#animationStart" ).bind( "click", onAnimationStart);
    $( "#voiceStart" ).bind( "click", onVoiceStart);
    $( "#expressionStart" ).bind( "click", onExpressionChange);
}
function onAvatarChange() {
    if(faceFiles == undefined || faceFiles == null || faceFiles.length <= 0)
        return;
    enableAnimButton();
    var faceId = mpwebgl.instance.loadnextface("items/face/" + faceFiles[faceIndex]);
    if(faceId == 0){
        if (++faceIndex == faceFiles.length)
            faceIndex = 0;
    }
    else
        console.error("load face fail");
}

function onHairChange() {
    if(hairDirs == undefined || hairDirs == null || hairDirs.length <= 0)
        return;
    hairId = mpwebgl.instance.loadhair('items/hair/' + hairDirs[hairIndex]);
    if(hairId){
        if (++hairIndex == hairDirs.length)
            hairIndex = 0;
    }
    else
        console.error("load hair fail");
}

function onBeardChange() {
    if(beardDirs == undefined || beardDirs == null || beardDirs.length <= 0)
        return;
    beardId = mpwebgl.instance.loadbeard('items/beard/' + beardDirs[beardIndex]);
    if(beardId > 0){
        if (++beardIndex == beardDirs.length)
            beardIndex = 0;
    }
    else
        console.error("load beard fail");
}

function onGlassesChange() {
    if(glassesDirs == undefined || glassesDirs == null || glassesDirs.length <= 0)
        return;
    glassesId = mpwebgl.instance.loadglasses('items/glasses/' + glassesDirs[glassesIndex]);
    if(glassesId > 0){
        if (++glassesIndex == glassesDirs.length)
            glassesIndex = 0;
    }
    else
        console.error("load glasses fail");
}

function onExpressionChange() {
    var maxIndex = 7;
    var expressId = mpwebgl.instance.loadexpression(expressionIndex, 100, 1.0, 1.0);
    if(expressId > 0){
        if (++expressionIndex == maxIndex)
            expressionIndex = 0;
    }
    else {
         console.error("load expression fail");
    }
}

function onVoiceStart() {
    if(voiceFiles == undefined || voiceFiles == null || voiceFiles.length <= 0)
        return;
    var typevoice = 2;
    var isPlaying = mpwebgl.instance.isanimplaying(typevoice);
    if(isPlaying == typevoice){
        mpwebgl.instance.pauseaudio();
        mpwebgl.instance.unloadanimation();
        mpwebgl.instance.destroyvoice();
        return;
    }
    var voiceId = mpwebgl.instance.loadvoice('items/voice/' + voiceFiles[voiceIndex]);
    if(voiceId > 0){
        if (++voiceIndex == voiceFiles.length)
            voiceIndex = 0;
    }
    else
        console.log("load voice fail");
}

function onAnimationStart() {
    if($(this).attr("disabled")){
        return;
    }
    var typevoice = 1;
    var isPlaying = mpwebgl.instance.isanimplaying(typevoice);
    if(isPlaying == typevoice){
        mpwebgl.instance.pauseaudio();
        mpwebgl.instance.unloadanimation();
        mpwebgl.instance.destroyvoice();
        return;
    }
    if(animDirs == undefined || animDirs == null || animDirs.length <= 0)
        return;
    var aniId = mpwebgl.instance.loadanimation('items/anim/' + animDirs[animIndex]);
    if(aniId > 0){
        if (++animIndex == animDirs.length)
            animIndex = 0;
    }
    else
         console.log("load animation fail");
}

function onhairclear() {
    mpwebgl.instance.unloadhair();
}

function onbeardclear() {
    mpwebgl.instance.unloadbear();
}

function onglassessclear() {
    mpwebgl.instance.unloadglasses();
}

function oncosmeclear() {
    mpwebgl.instance.unloadcosme();
}

function handleFileSelectAvtr(evt) {
    var files = evt.target.files;
    genMode = "avatar";
    mpwebgl.instance.requestAvatar(files[0], genMode);
    onloading();
}
function onloading(argument) {
    $(loadingbar).show();
    $(inputbar).hide();
}
function offloading(argument) {
    $("#filesavtr")[0].value = "";
      $(loadingbar).hide();
    $(inputbar).show();
}

jQuery(document).ready(function() {
    mpwebgl = $('#mpcanvas').mpwebgl({
        size: [],
        showfps: true,
        lookat: true
    });
    initLookAt();
    if(!inputbar)
        inputbar = $('#lblfilesavtr');
    if(!loadingbar)
        loadingbar = $("#loadingbar");
    
    $('#filesavtr').on("change", handleFileSelectAvtr);
    $(document).on("mpLoadComplete", function() {
        $("#mpcanvas").show();
        initEvt();
        if(faceFiles == undefined || faceFiles == null || faceFiles.length <= 0)
            return;
        var faceId = mpwebgl.instance.loadnextface("items/face/" + faceFiles[0]);
        if(faceId < 0)
            console.error("Load face error");
    });
    $(document).on("mpLoadYourAvatarComplete", function() {
        offloading();
        disableAnimButton();
    });
    $(document).on("mpGlobalError", function(e, data) {
        offloading();
        showError(data);
    });
    $(document).on("mpTimeoutRequestError", function(e, data) {
        offloading();
        showError(data);
    });
    if(!footer)
        footer = $("#mpfooter");
    var timeout, hidetime = 7000;
    footer.hover(function () {
        clearTimeout(timeout);
        setTimeout(showFooter, 0);
    }, function () {
        timeout = setTimeout(function(){
            hideFooter();
        },hidetime);
    });
    timeout = setTimeout(hideFooter, hidetime);
});
function hideFooter(argument) {
    footer.animate({
        opacity: 0.25,
        bottom : "-50"
    }, 1000, function() {
    });
}
function showFooter() {
    footer.animate({
        opacity: 1.0,
        bottom : "0"
    }, 100, function() {
    });
}
function disableAnimButton() {
    $("#animationStart").css( "opacity", 0.2);
    $("#animationStart").attr('disabled', true);
}
function enableAnimButton() {
    $("#animationStart").css( "opacity", 1.0);
    $("#animationStart").attr('disabled', false);
}

function onCosmeLipChange() {
    if(cosmeLips == undefined || cosmeLips == null || cosmeLips.length <= 0)
        return;
    var cosmeId = mpwebgl.instance.loadcosme('items/cosme/lip/' + cosmeLips[cosmeLipIndex] + '/cosme.csm', 0);
    if(cosmeId > 0){
        if (++cosmeLipIndex == cosmeLips.length)
            cosmeLipIndex = 0;
    }
    else
        console.error("load comse lip fail");
}
function onCosmeCheekChange() {
    if(cosmeCheeks == undefined || cosmeCheeks == null || cosmeCheeks.length <= 0)
        return;
    var cosmeId = mpwebgl.instance.loadcosme('items/cosme/cheek/' + cosmeCheeks[cosmeCheekIndex] + '/cosme.csm', 1);
    if(cosmeId > 0){
        if (++cosmeCheekIndex == cosmeCheeks.length)
            cosmeCheekIndex = 0;
    }
    else
        console.error("load comse cheek fail");
}
function onCosmeEyeChange() {
    if(cosmeEyes == undefined || cosmeEyes == null || cosmeEyes.length <= 0)
        return;
    var cosmeId = mpwebgl.instance.loadcosme('items/cosme/eye/' + cosmeEyes[cosmeEyeIndex] + '/cosme.csm', 2);
    if(cosmeId > 0){
        if (++cosmeEyeIndex == cosmeEyes.length)
            cosmeEyeIndex = 0;
    }
    else
        console.error("load comse eye fail");
}
function oncosmeclear() {
    mpwebgl.instance.unloadcosme(3); // LIP:0, EYE:1, CHEEK:2, ALL: 3
}
function showError(jsonStrErr){
    var errText = jsonStrErr.responseJSON.error.message;
    alert(errText);
}
function initLookAt(){
    if(!Module['canvas'])
        return;
    var c = Module['canvas'];
    $(c).on('mousemove', function(e) {
        if(!mpwebgl)
            return;
        var userAgent = window.navigator.userAgent.toLowerCase();
        var x = 0.5;
        var y = 0.5;
        var size = Module['canvas'].width;
        if (userAgent.indexOf('chrome') != -1) {
            x = e.offsetX / size;
            y = 1.0 - e.offsetY / size;
        } else if (userAgent.indexOf('safari') != -1) {
            x = e.offsetX / size;
            y = 1.0 - e.offsetY / size;
        } else if (userAgent.indexOf('gecko') != -1) {
            var bounds = c.getBoundingClientRect();
            x = (e.clientX - bounds.left) / size;
            y = 1.0 - (e.clientY - bounds.top) / size;
        } else if (userAgent.indexOf('ipad') != -1 || userAgent.indexOf('iphone') != -1) {
            var bounds = c.getBoundingClientRect();
            x = (e.clientX - bounds.left) / size;
            y = 1.0 - (e.clientY - bounds.top) / size;
        }
        mpwebgl.instance.lookat(x, y);
    });
    $(c).on('mouseout', function(e) {
        if(!mpwebgl)
            return;
        mpwebgl.instance.resetlookat();
    });
}
