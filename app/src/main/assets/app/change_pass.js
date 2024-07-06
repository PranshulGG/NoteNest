const changePassBtn = document.getElementById('change_app_password_toggle');
const changePasswordDialog = document.getElementById('changePasswordDialog');
const enter_old_pass_change = document.getElementById('enter_old_pass_change');
const enter_new_pass_change = document.getElementById('enter_new_pass_change');
const enter_new_pass_confirm_change = document.getElementById('enter_new_pass_confirm_change');
const saveNewCreatedPass = document.getElementById('saveNewCreatedPass');

if(localStorage.getItem('AppLockPassword')){
    changePassBtn.disabled = false;
} else{
    changePassBtn.disabled = true;
}

changePassBtn.addEventListener('click' ,() =>{
if(!changePassBtn.disabled){

    changePasswordDialog.show()
    dialogcolor()
}
});

changePasswordDialog.addEventListener('close', () =>{
    saveNewCreatedPass.disabled = true;


    setTimeout(() =>{
        enter_old_pass_change.value = ''
        enter_new_pass_change.value = ''
        enter_new_pass_confirm_change.value = ''
    }, 1000);

    checkTHEME()

});


function ChangePassInputCheck4(){
    if(document.getElementById('4-length-radio').checked){
    if (enter_old_pass_change.value.trim() === '' || enter_new_pass_change.value.trim().length < 4 || enter_new_pass_confirm_change.value.trim().length < 4){
        saveNewCreatedPass.disabled = true;
    } else{
        saveNewCreatedPass.disabled = false;
    }
} else{
    if (enter_old_pass_change.value.trim() === '' || enter_new_pass_change.value.trim().length < 8 || enter_new_pass_confirm_change.value.trim().length < 8){
        saveNewCreatedPass.disabled = true;
    } else{
        saveNewCreatedPass.disabled = false;
    }
}
}



enter_old_pass_change.addEventListener('input', ChangePassInputCheck4);
enter_new_pass_change.addEventListener('input', ChangePassInputCheck4);
enter_new_pass_confirm_change.addEventListener('input', ChangePassInputCheck4);


if(localStorage.getItem('PassLength') === '4-length'){
    document.getElementById('4-length-radio').checked = true;
    setTimeout(() =>{
        document.getElementById('4-length-radio').dispatchEvent(new Event('input'));
    }, 200);

} else if(localStorage.getItem('PassLength') === '8-length'){
    document.getElementById('8-length-radio').checked = true;

    setTimeout(() =>{
        document.getElementById('8-length-radio').dispatchEvent(new Event('input'));
    }, 200);

} else{
    document.getElementById('4-length-radio').checked = true;
    setTimeout(() =>{
        document.getElementById('4-length-radio').dispatchEvent(new Event('input'));
    }, 200);

}


saveNewCreatedPass.addEventListener('click', () =>{

    if(enter_old_pass_change.value === localStorage.getItem('AppLockPassword') && enter_new_pass_confirm_change.value === localStorage.getItem('tempPasswordNew')){
    if(document.getElementById('4-length-radio').checked){
        localStorage.setItem('PassLength', '4-length')
    } else{
        localStorage.setItem('PassLength', '8-length')
    }


    changePasswordDialog.close()

    setTimeout(() =>{
        localStorage.removeItem('tempPasswordNew');
        ShowSnack('Password changed!', 3000, 3, 'fixed', 'tab-content-2', '', 'no-up');
        localStorage.setItem('AppLockPassword', enter_new_pass_confirm_change.value);
    }, 760);
}

    if(enter_old_pass_change.value !== localStorage.getItem('AppLockPassword')){
        enter_old_pass_change.error = true;
        enter_old_pass_change.focus()
    } else if(enter_new_pass_confirm_change.value !== localStorage.getItem('tempPasswordNew')){
        enter_new_pass_confirm_change.error = true;
        enter_new_pass_confirm_change.focus()
    }


});

document.getElementById('4-length-radio').addEventListener('input', () =>{
    enter_new_pass_change.setAttribute('maxlength', '4');
    enter_new_pass_confirm_change.setAttribute('maxlength', '4');
    enter_new_pass_change.value = ''
    enter_new_pass_confirm_change.value = ''
    saveNewCreatedPass.disabled = true;
    
});

document.getElementById('8-length-radio').addEventListener('input', () =>{
    enter_new_pass_change.setAttribute('maxlength', '8');
    enter_new_pass_confirm_change.setAttribute('maxlength', '8');
    enter_new_pass_change.value = ''
    enter_new_pass_confirm_change.value = ''
    saveNewCreatedPass.disabled = true;
    


});



enter_new_pass_change.addEventListener('input', () =>{
    localStorage.setItem('tempPasswordNew', enter_new_pass_change.value)
});


enter_old_pass_change.addEventListener('input', () =>{
    if(enter_old_pass_change.error){
        enter_old_pass_change.error = false;
    }
});


enter_new_pass_confirm_change.addEventListener('input', () =>{
    if(enter_new_pass_confirm_change.error){
        enter_new_pass_confirm_change.error = false;
    }
});