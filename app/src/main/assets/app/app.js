const convertLinksToButtonOn = localStorage.getItem('ConvertLinksToBtn')


// lock app


const lockSetToggleSwitch = document.getElementById('Lock_app_toggle');
const selectLengthCreatePass = document.getElementById('length_create_pass');
const createPassInput = document.getElementById('createPassInput');
const next_btn_create_pass = document.getElementById('next_btn_create_pass');
const getPassLength = localStorage.getItem('PassLength')
const ConfirmCreatePassInput = document.getElementById('ConfirmCreatePassInput');

lockSetToggleSwitch.addEventListener('change', () => {

    localStorage.setItem('appLock', lockSetToggleSwitch.selected)

    if (lockSetToggleSwitch.selected) {
        if (!localStorage.getItem('AppLockPassword')) {
            document.getElementById('create_password').hidden = false;
        } else {
        }
    }
});

selectLengthCreatePass.addEventListener('input', () => {
    localStorage.setItem('PassLength', selectLengthCreatePass.value);
    createPassInput.value = ''
    // createPassInput.dispatchEvent(new Event('input'));

    if (selectLengthCreatePass.value === '4-length') {
        createPassInput.setAttribute('maxlength', '4')
        ConfirmCreatePassInput.setAttribute('maxlength', '4')
    } else {
        createPassInput.setAttribute('maxlength', '8')
        ConfirmCreatePassInput.setAttribute('maxlength', '8')

    }


})

if (getPassLength === '8-length') {
    document.querySelector(`[value="8-length"]`).selected = true;
    createPassInput.setAttribute('maxlength', '8')
} else {
    document.querySelector(`[value="4-length"]`).selected = true;
    createPassInput.setAttribute('maxlength', '4')

}


function checkValidCreatePassInfo() {
    if (getPassLength === '4-length' || selectLengthCreatePass.value === '4-length') {
        if (createPassInput.value.trim().length < 4) {
            next_btn_create_pass.setAttribute('clickable', 'false')
        } else {
            next_btn_create_pass.removeAttribute('clickable')
        }
    } else {
        if (createPassInput.value.trim().length < 8) {
            next_btn_create_pass.setAttribute('clickable', 'false')
        } else {
            next_btn_create_pass.removeAttribute('clickable')
        }
    }
}



createPassInput.addEventListener('input', checkValidCreatePassInfo)


next_btn_create_pass.addEventListener('click', () => {
    localStorage.setItem('tempPassCreate', createPassInput.value);
    document.getElementById('back_btn_create_pass').hidden = false
    document.getElementById('save_btn_create_pass').hidden = false;
    ConfirmCreatePassInput.hidden = false;
    ConfirmCreatePassInput.focus()
    createPassInput.hidden = true
    next_btn_create_pass.hidden = true;
    document.getElementById('pass_length_create_item').hidden = true;

    if (getPassLength === '4-length' || selectLengthCreatePass.value === '4-length') {
        ConfirmCreatePassInput.setAttribute('maxlength', '4')
        if (!getPassLength) {
            localStorage.setItem('PassLength', '4-length');
        }
    } else {
        ConfirmCreatePassInput.setAttribute('maxlength', '8')

    }
});

document.getElementById('back_btn_create_pass').addEventListener('click', () => {

    document.getElementById('back_btn_create_pass').hidden = true
    document.getElementById('save_btn_create_pass').hidden = true;
    ConfirmCreatePassInput.hidden = true;
    createPassInput.focus()
    createPassInput.hidden = false
    document.getElementById('pass_length_create_item').hidden = false;

    next_btn_create_pass.hidden = false;

})


document.getElementById('save_btn_create_pass').addEventListener('click', () => {
    if (ConfirmCreatePassInput.value !== localStorage.getItem('tempPassCreate')) {
        ConfirmCreatePassInput.error = true;
    } else {
        document.getElementById('create_password').hidden = true;
        ShowSnack('Password saved', 3000, 3, 'fixed', 'tab-content-2', '', 'no-up');
        localStorage.setItem('AppLockPassword', ConfirmCreatePassInput.value);

        changePassBtn.disabled = false;
        setTimeout(() => {
            localStorage.removeItem('tempPassCreate');
        }, 300);
    }
});


ConfirmCreatePassInput.addEventListener('input', () => {
    ConfirmCreatePassInput.error = false;
});

function exitCreatepassword() {
    document.getElementById('create_password').hidden = true;

    if (localStorage.getItem('AppLockPassword')) {
        lockSetToggleSwitch.selected = true;
    } else {
        lockSetToggleSwitch.click()
        localStorage.setItem('appLock', 'false')
        createPassInput.value = ''
        ConfirmCreatePassInput.value = ''
        document.getElementById('back_btn_create_pass').hidden = true
        document.getElementById('save_btn_create_pass').hidden = true;
        ConfirmCreatePassInput.hidden = true;
        createPassInput.hidden = false
        document.getElementById('pass_length_create_item').hidden = false;
        next_btn_create_pass.hidden = false;
    }
}


const enter_password = document.getElementById('enter_password');


if (localStorage.getItem('appLock') == 'true') {
    lockSetToggleSwitch.selected = true;
    enter_password.hidden = false;


} else {
    lockSetToggleSwitch.selected = false;
    enter_password.hidden = true;

}

if (!localStorage.getItem('AppLockPassword')) {
    localStorage.setItem('appLock', 'false')
    localStorage.removeItem('tempPassCreate')
    localStorage.removeItem('PassLength')
    enter_password.hidden = true;
    lockSetToggleSwitch.selected = false;

}

document.getElementById('entry_password_input').addEventListener('input', () => {
    document.querySelector('.entry_pass_access').removeAttribute('error', '')
    document.getElementById('passverify_result_text').innerText = 'Enter password';
    document.getElementById('passverify_result_text').style.color = ''
});

document.getElementById('enterAppPasswordVerify').addEventListener('click', () => {
    if (document.getElementById('entry_password_input').value !== localStorage.getItem('AppLockPassword')) {
        document.querySelector('.entry_pass_access').setAttribute('error', '')
        document.getElementById('entry_password_input').focus()
        document.getElementById('passverify_result_text').innerText = 'Wrong password';
        document.getElementById('passverify_result_text').style.color = 'var(--Error)'

        if ('vibrate' in navigator) {
            navigator.vibrate(300)
        }
    } else { 
        enter_password.hidden = true;
        Toast('Welcome!', 'short')

        setTimeout(() =>{
            document.getElementById('entry_password_input').value = '';
            if(document.getElementById('visibility_entry_pass_input').selected){
                document.getElementById('visibility_entry_pass_input').selected = false;
                document.getElementById('visibility_entry_pass_input').dispatchEvent(new Event('change'));
            }
        }, 300);
    }
});

document.getElementById('entry_password_input').addEventListener('keypress', () => {
    if (event.key === 'Enter') {
        if (document.getElementById('entry_password_input').value !== localStorage.getItem('AppLockPassword')) {
            document.querySelector('.entry_pass_access').setAttribute('error', '')
            document.getElementById('entry_password_input').focus()
            document.getElementById('passverify_result_text').innerText = 'Wrong password';
            document.getElementById('passverify_result_text').style.color = 'var(--Error)'

            if ('vibrate' in navigator) {
                navigator.vibrate(300)
            }

        } else {
            enter_password.hidden = true;

            Toast('Welcome!', 'short')

            setTimeout(() =>{
                document.getElementById('entry_password_input').value = '';
                if(document.getElementById('visibility_entry_pass_input').selected){
                    document.getElementById('visibility_entry_pass_input').selected = false;
                    document.getElementById('visibility_entry_pass_input').dispatchEvent(new Event('change'));
                }
            }, 300);
        }
    }
});


const deleteDataDialog = document.getElementById('deleteDataDialog');
const cancelDataDelete = document.getElementById('cancelDataDelete');
const VerifyDeleteData = document.getElementById('VerifyDeleteData');
const verifyPassDeleteDataInput = document.getElementById('verifyPassDeleteDataInput');

function clearAppData() {
    if (localStorage.getItem('appLock') == 'true') {
        deleteDataDialog.show()
        dialogcolor()
    } else {
        document.getElementById('confirmDeleteDataDialog').show()
        dialogcolor()
    }

}


deleteDataDialog.addEventListener('close', () => {
    checkTHEME()
    verifyPassDeleteDataInput.value = '';
    if (verifyPassDeleteDataInput.error) {
        verifyPassDeleteDataInput.error = false;
    }
});


verifyPassDeleteDataInput.addEventListener('input', () => {
    if (verifyPassDeleteDataInput.error) {
        verifyPassDeleteDataInput.error = false;
    }
})

VerifyDeleteData.addEventListener('click', () => {
    if (verifyPassDeleteDataInput.value !== localStorage.getItem('AppLockPassword')) {
        verifyPassDeleteDataInput.error = true;
        return;
    } else {
        VerifyDeleteData.innerHTML = `<md-circular-progress indeterminate style="--md-circular-progress-size: 33px;"></md-circular-progress>`
        VerifyDeleteData.style.pointerEvents = 'none'

        setTimeout(() => {
            deleteDataDialog.close()
            VerifyDeleteData.innerHTML = 'Delete'
            VerifyDeleteData.style.pointerEvents = ''
        }, 1000);

        setTimeout(() => {
            localStorage.clear();
            Toast('App data was cleared', 'long')
        }, 1010);

        setTimeout(() => {
            window.location.reload()
        }, 2000);
    }
});


document.getElementById('confirmDeleteDataDialog').addEventListener('close', () => {
    checkTHEME()
});


document.getElementById('clearConfirmDataBtnOK').addEventListener('click', () => {
    Toast('App data was cleared', 'long')

    setTimeout(() => {
        window.location.reload()
        localStorage.clear();
    }, 600);
});


const grid_4x4Toggle = document.getElementById('grid_4x4');


grid_4x4Toggle.addEventListener('change', () => {
    if (grid_4x4Toggle.selected) {
        localStorage.setItem('GridType', '4x4');
        document.getElementById('notesContainer').classList.add('grid');
    } else {
        localStorage.setItem('GridType', 'default')
        document.getElementById('notesContainer').classList.remove('grid');
    }
});

const Grid_Type = localStorage.getItem('GridType');


if (Grid_Type === '4x4') {
    grid_4x4Toggle.selected = true;
    document.getElementById('notesContainer').classList.add('grid');
} else {
    grid_4x4Toggle.selected = false;
    document.getElementById('notesContainer').classList.remove('grid');
}







// convert links 


const convertLinksToButtonToggle = document.getElementById('convertLinksToButtonToggle');

convertLinksToButtonToggle.addEventListener('change', () => {
    localStorage.setItem('ConvertLinksToBtn', convertLinksToButtonToggle.selected);

    if (convertLinksToButtonToggle.selected) {
        document.getElementById('selectLinkButtonTypeListMd').disabled = false;

    } else {
        document.getElementById('selectLinkButtonTypeListMd').disabled = true;
    }
})


if (convertLinksToButtonOn === 'true') {
    convertLinksToButtonToggle.selected = true;
    document.getElementById('selectLinkButtonTypeListMd').disabled = false;
} else {
    convertLinksToButtonToggle.selected = false;
    document.getElementById('selectLinkButtonTypeListMd').disabled = true;

}

const selectLinkButtonType = document.getElementById('selectLinkButtonType');

selectLinkButtonType.addEventListener('input', () => {
    localStorage.setItem('LinkButtonType', selectLinkButtonType.value)
});

if (localStorage.getItem('LinkButtonType') === 'filled') {
    document.querySelector('[value="filled"]').selected = true
} else if (localStorage.getItem('LinkButtonType') === 'outlined') {
    document.querySelector('[value="outlined"]').selected = true

} else if (localStorage.getItem('LinkButtonType') === 'filled-tonal') {
    document.querySelector('[value="filled-tonal"]').selected = true

} else {
    localStorage.setItem('LinkButtonType', 'filled')

}

// link color


document.getElementById('useDefaultLinkColor').addEventListener('change', () => {

    localStorage.setItem('DefaultLinkColor', document.getElementById('useDefaultLinkColor').checked)

    if (document.getElementById('useDefaultLinkColor').checked) {
        document.getElementById('ViewnoteContent').classList.add('defaultLinkColor');
        notesContainer.classList.add('defaultLinkColorPrev');

    } else {
        document.getElementById('ViewnoteContent').classList.remove('defaultLinkColor');
        notesContainer.classList.remove('defaultLinkColorPrev');

    }
});


if (localStorage.getItem('DefaultLinkColor') === 'true') {

    document.getElementById('useDefaultLinkColor').checked = true;
    document.getElementById('ViewnoteContent').classList.add('defaultLinkColor');
    notesContainer.classList.add('defaultLinkColorPrev');

} else {

    document.getElementById('useDefaultLinkColor').checked = false;
    document.getElementById('ViewnoteContent').classList.remove('defaultLinkColor');
    notesContainer.classList.remove('defaultLinkColorPrev');


}

// smalfab


const useSmallFabToggle = document.getElementById('useSmallFabToggle');


useSmallFabToggle.addEventListener('change', () => {
    localStorage.setItem('UseSmallFab', useSmallFabToggle.selected);

    if (useSmallFabToggle.selected) {
        document.getElementById('AddTodo').setAttribute('label', '')
        document.getElementById('AddNote').setAttribute('label', '')
        document.querySelector('[fab="fab_1"]').style.alignItems = "center";
        document.getElementById('addNewLabelFab').setAttribute('label', '')
        document.getElementById('addLabelToCurrentNoteFab').setAttribute('label', '')

    } else {
        document.getElementById('AddTodo').setAttribute('label', 'Add task')
        document.getElementById('AddNote').setAttribute('label', 'Add note')
        document.querySelector('[fab="fab_1"]').style.alignItems = "flex-end";
        document.getElementById('addNewLabelFab').setAttribute('label', 'New label')
        document.getElementById('addLabelToCurrentNoteFab').setAttribute('label', 'Add label')


    }
});

const UseSmallFabBtnOn = localStorage.getItem('UseSmallFab');


if (UseSmallFabBtnOn === 'true') {
    useSmallFabToggle.selected = true;
    document.getElementById('AddTodo').setAttribute('label', '')
    document.getElementById('AddNote').setAttribute('label', '')
    document.querySelector('[fab="fab_1"]').style.alignItems = "center";
    document.getElementById('addNewLabelFab').setAttribute('label', '')
    document.getElementById('addLabelToCurrentNoteFab').setAttribute('label', '')


} else {
    useSmallFabToggle.selected = false;
    document.getElementById('AddTodo').setAttribute('label', 'Add task')
    document.getElementById('AddNote').setAttribute('label', 'Add note')
    document.querySelector('[fab="fab_1"]').style.alignItems = "flex-end";
    document.getElementById('addNewLabelFab').setAttribute('label', 'New label')
    document.getElementById('addLabelToCurrentNoteFab').setAttribute('label', 'Add label')

}

// open page

function openPage(page, pageName) {

            if (page === '/pages/privacyPolicy.txt') {
                document.querySelector('.viewAboutPageContent').innerHTML = privacyPolicy;

            } else if(page === '/pages/TermsConditions.txt'){
                document.querySelector('.viewAboutPageContent').innerHTML = TermsConditions;
            } else{
                document.querySelector('.viewAboutPageContent').innerHTML = licenses;
            }



    document.getElementById('pageNameViewPage').innerHTML = pageName

    document.getElementById('viewAboutPages').hidden = false;
    window.history.pushState({ AboutPageViewOpen: true }, "");

}

function closeAboutPageView() {
    document.getElementById('viewAboutPages').style.opacity = '0';

setTimeout(() =>{
        document.querySelector('.viewAboutPageContent').scrollTop = 0;
}, 250);

    setTimeout(() => {
        document.getElementById('viewAboutPages').hidden = true;
        document.getElementById('viewAboutPages').style.opacity = '';
        document.querySelector('.viewAboutPageContent').innerHTML = '';


    }, 300);
}

window.addEventListener('popstate', function (event) {
    if (!document.getElementById('viewAboutPages').hidden) {
        closeAboutPageView()
    }
});


// short url


const ShortUrlButtonToggle = document.getElementById('ShortUrlButtonToggle');

ShortUrlButtonToggle.addEventListener('change', () => {
    localStorage.setItem('ShortUrlForLinkButton', ShortUrlButtonToggle.selected);
});

const ShortUrlButtonON = localStorage.getItem('ShortUrlForLinkButton');


if (ShortUrlButtonON === 'true') {
    ShortUrlButtonToggle.selected = true;
} else if (ShortUrlButtonON === 'false') {
    ShortUrlButtonToggle.selected = false;
} else {
    ShortUrlButtonToggle.selected = true;
}


// add labels


const addLabelsNotes = document.getElementById('addLabelsNotes');
const addLabelsScreen = document.getElementById('addLabelsScreen');


addLabelsNotes.addEventListener('click', () => {
    addLabelsScreen.hidden = false;
    window.history.pushState({ LabelsPageOpen: true }, "");
    ActivityColor()

    if(document.getElementById('headUser-9').scrollTop > 0){
        document.getElementById('headUser-9').scrollTop = 0
    }
        

});


function closeaddLabelsNotes() {
    addLabelsScreen.style.opacity = '0';
    checkTHEME()

    setTimeout(() => {
        addLabelsScreen.hidden = true;
        addLabelsScreen.style.opacity = '';
     const allLabelsAddedCheckboxUnchecked = document.querySelectorAll('.NotesLabelCheckboxes');

     allLabelsAddedCheckboxUnchecked.forEach((allLabelAddedCheckboxUnchecked) =>{
        if(allLabelAddedCheckboxUnchecked.checked){
            allLabelAddedCheckboxUnchecked.checked = false;
            allLabelAddedCheckboxUnchecked.dispatchEvent(new Event('change'));
        }
     });


    }, 300);

}

window.addEventListener('popstate', function (event) {

    if (!addLabelsScreen.hidden) {
        closeaddLabelsNotes()
    }

    if (addLabelDialog.open) {
        addLabelDialog.close();
        setTimeout(() => {
            checkTHEME()
        }, 200);
    }
});


// show dialogs confirm


const ShowconfirmationdialogsSelectBtn = document.getElementById('ShowconfirmationdialogsSelectBtn');
const showconfirmationdialogsSelectionDialog = document.getElementById('showconfirmationdialogsSelectionDialog');

ShowconfirmationdialogsSelectBtn.addEventListener('click', () => {
    showconfirmationdialogsSelectionDialog.show();
    window.history.pushState({ showconfirmationdialogsSelectionDialog: true }, "");

    dialogcolor()
});

showconfirmationdialogsSelectionDialog.addEventListener('close', () => {
    checkTHEME()
});

document.querySelectorAll('md-radio[name="ShowconfirmationdialogsRadioGroup"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        saveSelectedRadioOptionShowDialogToLocalStorage(event.target.value);
    });
});


function saveSelectedRadioOptionShowDialogToLocalStorage(value) {
    localStorage.setItem('ShowconfirmationdialogsRadio', value);
    document.getElementById('confirmationSeletedOpenText').innerHTML = value;
    window.history.back()
}

function loadSelectedRadioOptionShowDialogToLocalStorage() {
    const savedValue = localStorage.getItem('ShowconfirmationdialogsRadio');
    if (savedValue) {
        document.getElementById(savedValue).checked = true;

        document.getElementById('confirmationSeletedOpenText').innerHTML = savedValue;

    }
}

document.addEventListener('DOMContentLoaded', loadSelectedRadioOptionShowDialogToLocalStorage);


window.addEventListener('popstate', function (event) {
    if (showconfirmationdialogsSelectionDialog.open) {
        showconfirmationdialogsSelectionDialog.close()
    }
});

showconfirmationdialogsSelectionDialog.addEventListener('cancel', () => {
    setTimeout(() => {
        window.history.back()
        console.log('back')
    }, 300);
});


// export

document.getElementById('exportBtn').addEventListener('click', () => {
    let notes = localStorage.getItem('notes');

    if (notes !== null) {
        let parsedNotes = JSON.parse(notes);
        if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
            let dataStr = JSON.stringify(parsedNotes, null, 2);
            Android.saveFile(dataStr);
        } else {
            Toast('No notes found', 'short')
        }
    } else {
        Toast('No notes found', 'short')
    }
});







document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                let importedNotes = JSON.parse(e.target.result);

                if (!Array.isArray(importedNotes)) {
                    importedNotes = [importedNotes];
                }

                let existingNotes = localStorage.getItem('notes');
                if (existingNotes) {
                    existingNotes = JSON.parse(existingNotes);
                } else {
                    existingNotes = [];
                }

                const mergedNotes = [...existingNotes, ...importedNotes];

                localStorage.setItem('notes', JSON.stringify(mergedNotes));
                Toast('Notes imported successfully!', 'short')
                       notesContainer.innerHTML = ''

                       setTimeout(() =>{
                           initializeNotes()
                       }, 200);

            } catch (error) {
                alert('Error parsing JSON file. Please make sure it is correctly formatted.');
                return;
            }
        };
        reader.readAsText(file);
    }
});



const autoLockAppSleepSwitch = document.getElementById('autoLockAppSleepSwitch');
const autoLockAppSleepSwitchSaveDLocal = localStorage.getItem('AutoAppLock');

if (document.getElementById('Lock_app_toggle').selected) {
    document.getElementById('autoLockAppMdItem').disabled = false;
} else {
    document.getElementById('autoLockAppMdItem').disabled = true;
}

document.getElementById('Lock_app_toggle').addEventListener('change', ()=>{
    if(document.getElementById('Lock_app_toggle').selected){
        if(autoLockAppSleepSwitch.selected){
        AppAutoLockListener()
        }
    document.getElementById('autoLockAppMdItem').disabled = false;

    } else{
        AppAutoLockListenerRemove()
    document.getElementById('autoLockAppMdItem').disabled = true;
    }

});



autoLockAppSleepSwitch.addEventListener('change', ()=>{
    localStorage.setItem('AutoAppLock', autoLockAppSleepSwitch.selected);

    if(autoLockAppSleepSwitch.selected){
        if(document.getElementById('Lock_app_toggle').selected){
        AppAutoLockListener()
        }
    } else{
        AppAutoLockListenerRemove()
    }

});


if(autoLockAppSleepSwitchSaveDLocal === 'true'){
    autoLockAppSleepSwitch.selected = true;
    if(document.getElementById('Lock_app_toggle').selected){
        AppAutoLockListener()
        }

} else{
    autoLockAppSleepSwitch.selected = false;
    AppAutoLockListenerRemove()

}


function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
        if(enter_password.hidden === true){
        enter_password.hidden = false;
        }
    }
}

function AppAutoLockListener() {
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

function AppAutoLockListenerRemove() {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
}



// edit profile

const EditprofileDialog = document.getElementById('EditprofileDialog');

function profileEdit(){
    EditprofileDialog.show()
    document.getElementById('EnterYourNameProfile').dispatchEvent(new Event('input'));
    
    if(localStorage.getItem('ProfileUserName')){
    document.getElementById('EnterYourNameProfile').value = localStorage.getItem('ProfileUserName')
    }
    if(localStorage.getItem('ProfileImg')){
    document.getElementById('profilePicChangerImg').src = localStorage.getItem('ProfileImg')
    }
    
    dialogcolor()

}

EditprofileDialog.addEventListener('close', () =>{
    checkTHEME()

})

function changeProfilePic(){
    document.getElementById('changeProfilePicInput').click()
}

document.getElementById('changeProfilePicInput').addEventListener('input', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePicChangerImg').src = e.target.result;
            
        }
        reader.readAsDataURL(file);
    }
});



function UpdateProfile(){
    localStorage.setItem('ProfileImg', document.getElementById('profilePicChangerImg').src)
    localStorage.setItem('ProfileUserName', document.getElementById('EnterYourNameProfile').value)

    document.getElementById('prevProfileIMg').src = document.getElementById('profilePicChangerImg').src;
    document.getElementById('profileName').innerHTML = document.getElementById('EnterYourNameProfile').value;
    Toast('Profile updated!', 'short')
    EditprofileDialog.close()

}

if(localStorage.getItem('ProfileImg')){
    document.getElementById('profilePicChangerImg').src = localStorage.getItem('ProfileImg')
    document.getElementById('prevProfileIMg').src = localStorage.getItem('ProfileImg')
} else{
    document.getElementById('prevProfileIMg').src = 'profile.png'
    document.getElementById('profilePicChangerImg').src ='profile.png'

}


if(localStorage.getItem('ProfileUserName')){
    document.getElementById('EnterYourNameProfile').value = localStorage.getItem('ProfileUserName')
    document.getElementById('profileName').innerHTML = localStorage.getItem('ProfileUserName')

}
else{
    document.getElementById('EnterYourNameProfile').value = ''
    document.getElementById('profileName').innerHTML ='Your name'

}

document.getElementById('EnterYourNameProfile').addEventListener('input', ()=>{

        if(document.getElementById('EnterYourNameProfile').value.trim() === ""){
            document.getElementById('updateProfileBtn').disabled = true;
        } else{
            document.getElementById('updateProfileBtn').disabled = false;
        }    
})

// text data
// for some reason fetch was not working inside webview

const privacyPolicy = `<p>This privacy policy applies to the NoteNest app (hereby referred to as "Application") for mobile devices that was created by Pranshul (hereby referred to as "Service Provider") as an Open Source service. This service is intended for use "AS IS".</p><br><strong>Information Collection and Use</strong><p>The Application collects information when you download and use it. This information may include information such as</p><ul><li>Your device's Internet Protocol address (e.g. IP address)</li><li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li><li>The time spent on the Application</li><li>The operating system you use on your mobile device</li></ul><p></p><br><p>The Application does not gather precise information about the location of your mobile device.</p><div style="display: none;"><p>The Application collects your device's location, which helps the Service Provider determine your approximate geographical location and make use of in below ways:</p><ul><li>Geolocation Services: The Service Provider utilizes location data to provide features such as personalized content, relevant recommendations, and location-based services.</li><li>Analytics and Improvements: Aggregated and anonymized location data helps the Service Provider to analyze user behavior, identify trends, and improve the overall performance and functionality of the Application.</li><li>Third-Party Services: Periodically, the Service Provider may transmit anonymized location data to external services. These services assist them in enhancing the Application and optimizing their offerings.</li></ul></div><br><p>The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.</p><br><p>For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information. The information that the Service Provider request will be retained by them and used as described in this privacy policy.</p><br><strong>Third Party Access</strong><p>Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.</p><!----><br><p>The Service Provider may disclose User Provided and Automatically Collected Information:</p><ul><li>as required by law, such as to comply with a subpoena, or similar legal process;</li><li>when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li><li>with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.</li></ul><p></p><br><strong>Opt-Out Rights</strong><p>You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.</p><br><strong>Data Retention Policy</strong><p>The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at pranshul.devmain@gmail.com and they will respond in a reasonable time.</p><br><strong>Children</strong><p>The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.</p><!----><div><br><p>The Service Provider does not knowingly collect personally identifiable information from children. The Service Provider encourages all children to never submit any personally identifiable information through the Application and/or Services. The Service Provider encourage parents and legal guardians to monitor their children's Internet usage and to help enforce this Policy by instructing their children never to provide personally identifiable information through the Application and/or Services without their permission. If you have reason to believe that a child has provided personally identifiable information to the Service Provider through the Application and/or Services, please contact the Service Provider (pranshul.devmain@gmail.com) so that they will be able to take the necessary actions. You must also be at least 16 years of age to consent to the processing of your personally identifiable information in your country (in some countries we may allow your parent or guardian to do so on your behalf).</p></div><br><strong>Security</strong><p>The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.</p><br><strong>Changes</strong><p>This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.</p><br><p>This privacy policy is effective as of 2024-06-30</p><br><strong>Your Consent</strong><p>By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.</p><br><strong>Contact Us</strong><p>If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider</p><h2>By mail</h2><md-outlined-button href="mailto:pranshul.devmain@gmail.com">pranshul.devmain@gmail.com</md-outlined-button><br><p>This privacy policy page was generated by <a href="https://app-privacy-policy-generator.nisrulz.com/" target="_blank" rel="noopener noreferrer">App Privacy Policy Generator</a></p>`

const TermsConditions = `<br><p>These terms and conditions applies to the NoteNest app (hereby referred to as "Application") for mobile devices that was created by Pranshul (hereby referred to as "Service Provider") as an Open Source service.</p><br><p>Upon downloading or utilizing the Application, you are automatically agreeing to the following terms. It is strongly advised that you thoroughly read and understand these terms prior to using the Application. Unauthorized copying, modification of the Application, any part of the Application, or our trademarks is strictly prohibited. Any attempts to extract the source code of the Application, translate the Application into other languages, or create derivative versions are not permitted. All trademarks, copyrights, database rights, and other intellectual property rights related to the Application remain the property of the Service Provider.</p><br><p>The Service Provider is dedicated to ensuring that the Application is as beneficial and efficient as possible. As such, they reserve the right to modify the Application or charge for their services at any time and for any reason. The Service Provider assures you that any charges for the Application or its services will be clearly communicated to you.</p><br><p>The Application stores and processes personal data that you have provided to the Service Provider in order to provide the Service. It is your responsibility to maintain the security of your phone and access to the Application. The Service Provider strongly advise against jailbreaking or rooting your phone, which involves removing software restrictions and limitations imposed by the official operating system of your device. Such actions could expose your phone to malware, viruses, malicious programs, compromise your phone's security features, and may result in the Application not functioning correctly or at all.</p><!----><br><p>Please be aware that the Service Provider does not assume responsibility for certain aspects. Some functions of the Application require an active internet connection, which can be Wi-Fi or provided by your mobile network provider. The Service Provider cannot be held responsible if the Application does not function at full capacity due to lack of access to Wi-Fi or if you have exhausted your data allowance.</p><br><p>If you are using the application outside of a Wi-Fi area, please be aware that your mobile network provider's agreement terms still apply. Consequently, you may incur charges from your mobile provider for data usage during the connection to the application, or other third-party charges. By using the application, you accept responsibility for any such charges, including roaming data charges if you use the application outside of your home territory (i.e., region or country) without disabling data roaming. If you are not the bill payer for the device on which you are using the application, they assume that you have obtained permission from the bill payer.</p><br><p>Similarly, the Service Provider cannot always assume responsibility for your usage of the application. For instance, it is your responsibility to ensure that your device remains charged. If your device runs out of battery and you are unable to access the Service, the Service Provider cannot be held responsible.</p><br><p>In terms of the Service Provider's responsibility for your use of the application, it is important to note that while they strive to ensure that it is updated and accurate at all times, they do rely on third parties to provide information to them so that they can make it available to you. The Service Provider accepts no liability for any loss, direct or indirect, that you experience as a result of relying entirely on this functionality of the application.</p><br><p>The Service Provider may wish to update the application at some point. The application is currently available as per the requirements for the operating system (and for any additional systems they decide to extend the availability of the application to) may change, and you will need to download the updates if you want to continue using the application. The Service Provider does not guarantee that it will always update the application so that it is relevant to you and/or compatible with the particular operating system version installed on your device. However, you agree to always accept updates to the application when offered to you. The Service Provider may also wish to cease providing the application and may terminate its use at any time without providing termination notice to you. Unless they inform you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must cease using the application, and (if necessary) delete it from your device.</p><br><strong>Changes to These Terms and Conditions</strong><p>The Service Provider may periodically update their Terms and Conditions. Therefore, you are advised to review this page regularly for any changes. The Service Provider will notify you of any changes by posting the new Terms and Conditions on this page.</p><br><p>These terms and conditions are effective as of 2024-06-30</p><br><strong>Contact Us</strong><p>If you have any questions or suggestions about the Terms and Conditions, please do not hesitate to contact the Service Provider</p><h2>By mail</h2><md-outlined-button href="mailto:pranshul.devmain@gmail.com">pranshul.devmain@gmail.com</md-outlined-button><br><p>This Terms and Conditions page was generated by <a href="https://app-privacy-policy-generator.nisrulz.com/" target="_blank" rel="noopener noreferrer">App Privacy Policy Generator</a></p>`;

const licenses = `<div class="licenses-div" onclick="window.location.href='https://fonts.google.com/specimen/Outfit?query=outfit'" style="margin-left: 0; margin-right: 0; position: relative; margin-top: 20px;">
                    <h2 class="name-main">Outfit </h2>
                    <span class="name-label">Rodrigo Fuenzalida, Smartsheet Inc</span>
                    <p class="main-license">A beautiful geometric sans: The official typeface for brand automation
                        company outfit.io. Inspired by the ligature-rich outfit wordmark, Outfit.io is delighted to
                        release it's own type family. The Outfit typeface links the Outfit written voice to Outfit
                        product marks; on brand by default.</p>
                    <span class="license-label">Open Font License</span>
                    <md-ripple style="--md-ripple-pressed-opacity: 0.13;"></md-ripple>
                </div>

                <div class="licenses-div" onclick="window.location.href='https://fonts.google.com/specimen/Poppins?query=poppins'" style="margin-left: 0; margin-right: 0; position: relative;">
                    <h2 class="name-main">Poppins </h2>
                    <span class="name-label">Indian Type Foundry, Jonny Pinhorn</span>
                    <p class="main-license">Poppins is a geometric sans serif font supporting Devanagari and Latin
                        scripts. Its Latin glyphs are rationalist, while the Devanagari design, introduced in 2015, was
                        pioneering, featuring various weights. Developed by Indian Type Foundry, Poppins maintains
                        monolinear letterforms with optical corrections. It later expanded to include multiple weights
                        and italics by the ITF studio team. </p>
                    <span class="license-label">Open Font License</span>

                    <md-ripple style="--md-ripple-pressed-opacity: 0.13;"></md-ripple>
                </div>

                <div class="licenses-div" onclick="window.location.href='https://github.com/material-components/material-web'" style="margin-left: 0; margin-right: 0; position: relative;">
                    <h2 class="name-main">Material design components </h2>
                    <span class="name-label">Open Source Project</span>
                    <p class="main-license">Material Web, or MWC, is a web component library aligned with Google's
                        Material Design guidelines. Supported by Google, it offers guidance for creating Material apps
                        and components, accessible on material.io. Material 3, the latest version, enhances experiences
                        with dynamic color, better accessibility, and support for large screen layouts and design
                        tokens.</p>
                    <span class="license-label">Apache-2.0</span>
                    <md-ripple style="--md-ripple-pressed-opacity: 0.13;"></md-ripple>
                </div>

            <br>`