function initializeNotes() {
    if (localStorage.getItem('notes')) {
        const savedNotes = JSON.parse(localStorage.getItem('notes'));

        savedNotes.forEach(note => {
            renderNote(note.heading, note.content, note.date, note.AddedChips);

        });

        if(savedNotes.length === 0){
            document.getElementById('mark_1').hidden = false;
        } else{
            document.getElementById('mark_1').hidden = true;
            
        }
    
    }
}

function saveNotesToLocalStorage() {
    const notes = [];
    const noteElements = document.querySelectorAll('.note');


    noteElements.forEach(noteElement => {
        const heading = noteElement.querySelector('h3').textContent;
        const content = noteElement.querySelector('p').innerHTML;
        const date = noteElement.querySelector('span').innerHTML;
        const AddedChips = noteElement.querySelector('hiddenPrev').innerHTML;
        notes.push({ heading, content, date, AddedChips});
    });

    if(notes.length === 0){
        document.getElementById('mark_1').hidden = false;
    } else{
        document.getElementById('mark_1').hidden = true;
        
    }

    localStorage.setItem('notes', JSON.stringify(notes));
}

const modal = document.getElementById('AddNoteModal');
const btn = document.getElementById('AddNote');
const span = document.getElementsByClassName('closeModalNote')[0];

btn.onclick = function () {
    modal.hidden = false;
    ActivityColor();
    window.history.pushState({ AddNoteModalOpen: true }, "");

    setTimeout(() =>{
        document.getElementById('noteHeading').focus()
    }, 300);
}

span.onclick = function () {
    window.history.back()
}

function closeaddNoteModal() {
    modal.style.opacity = '0'

    document.getElementById('noteHeading').value = '';
    document.getElementById('noteContent').value = '';

    setTimeout(() => {
        modal.hidden = true;
        modal.style.opacity = ''
        document.getElementById('noteContent').style = '';
        document.getElementById('noteHeading').style = '';
        

    }, 250);

    checkTHEME()

}

window.addEventListener('popstate', function (event) {
    if(!modal.hidden){
    closeaddNoteModal();
    setTimeout(() =>{
        document.getElementById('addedChips').innerHTML = ''
    }, 300);
}

    if(SelectLabelsToAddDialog.open){
        SelectLabelsToAddDialog.close()

        setTimeout(() =>{
            checkTHEME()
        }, 200);
    }
});


const saveNoteBtn = document.getElementById('saveNoteBtn');
const notesContainer = document.getElementById('notesContainer');
const saveNoteBtnEdit = document.getElementById('saveNoteBtnEdit');

saveNoteBtn.onclick = function () {



    const noteHeading = document.getElementById('noteHeading').value;
    let noteContent = document.getElementById('noteContent').value;

    const AllAddedChips = document.getElementById('addedChips').querySelectorAll('md-input-chip');

    if (noteHeading.trim() === '' || noteContent.trim() === '') {

       ShowSnack('Enter title and note content', 3000, 2, 'none', 'headUser-2', 'fab_3', '')


        return;
    }

    noteContent = linkifyPreview(noteContent);

    const AllchipsArray = []


    const currentDate = new Date().toLocaleDateString('en-GB'); 

    const note = { heading: noteHeading, content: noteContent,date: currentDate, AddedChips: AllchipsArray};


    AllAddedChips.forEach((AllAddedChip) =>{

        AllchipsArray.push(AllAddedChip.getAttribute('UseAs'))

    });


    renderNote(noteHeading, noteContent, currentDate,AllchipsArray)

    saveNotesToLocalStorage();



    document.getElementById('noteHeading').value = '';
    document.getElementById('noteContent').value = '';

    setTimeout(() =>{
        document.getElementById('addedChips').innerHTML = ''
    }, 300);
    window.history.back()


}

function renderNote(heading, content, date, AllAddedChip) {

    const menuIDRandom = 'Menu-' + Date.now();
    const menuIDRandomMenu = 'MenuAnchor-' + Date.now();

    const menuWrapper = document.createElement('WrapMenu');
    
    const noteElement = document.createElement('div');
    const noteRipple = document.createElement('md-ripple')
    const noteTouch = document.createElement('note-touch')
    noteRipple.style = '--md-ripple-pressed-opacity: 0.13;'

    const menuMainOptions = document.createElement('md-menu');
    menuMainOptions.setAttribute('positioning', 'popover');
    menuMainOptions.id = menuIDRandomMenu;
    menuMainOptions.setAttribute('anchor', menuIDRandom);
    menuMainOptions.setAttribute('anchor-corner', 'start-start');

    // menu-btns
    const deleteMenuBtn = document.createElement('md-menu-item')
    deleteMenuBtn.setAttribute('menu-type', '')
    deleteMenuBtn.innerHTML = `<div slot="headline">Delete</div>`

    const editMenuBtn = document.createElement('md-menu-item')
    editMenuBtn.setAttribute('menu-type', '')
    editMenuBtn.innerHTML = `<div slot="headline">Edit</div>`;

    const chipwrapprev = document.createElement('chipwrapprev')

    if(AllAddedChip.length === 0){
    noteElement.setAttribute('NoTags', 'true')
        
    }



    if(AllAddedChip){
    if (Array.isArray(AllAddedChip)) {
        AllAddedChip.forEach(tag => {
            let chipTag = document.createElement('md-assist-chip');
            chipTag.setAttribute('label', tag.trim());

            if (chipTag.label.toLowerCase() === 'important' ||chipTag.label.toLowerCase() === 'star') {
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>star</md-icon>';
            } else if(chipTag.label.toLowerCase() === 'fav' ||chipTag.label.toLowerCase() === 'favorite'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>favorite</md-icon>';
            } else if(chipTag.label.toLowerCase() === 'link' ||chipTag.label.toLowerCase() === 'links'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>link</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'list' ||chipTag.label.toLowerCase() === 'lists'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>list</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'cook' ||chipTag.label.toLowerCase() === 'cooking'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>cooking</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'work' ||chipTag.label.toLowerCase() === 'working'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>work</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'todo' ||chipTag.label.toLowerCase() === 'todos'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>task_alt</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'idea' ||chipTag.label.toLowerCase() === 'ideas'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>lightbulb</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'search' ||chipTag.label.toLowerCase() === 'searching'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>manage_search</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'Reminder' ||chipTag.label.toLowerCase() === 'Reminders' || chipTag.label.toLowerCase() === 'Remind'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>notifications_active</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'shop' ||chipTag.label.toLowerCase() === 'shopping list'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>shopping_cart</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'health' ||chipTag.label.toLowerCase() === 'healthy'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>health_and_safety</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'warm' ||chipTag.label.toLowerCase() === 'hot'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>local_fire_department</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'travel' ||chipTag.label.toLowerCase() === 'traveling'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>travel_explore</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'password' ||chipTag.label.toLowerCase() === 'passwords'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>password</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'safe' ||chipTag.label.toLowerCase() === 'save'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>private_connectivity</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'name' ||chipTag.label.toLowerCase() === 'names'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>id_card</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'wifi' ||chipTag.label.toLowerCase() === 'internet'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>wifi</md-icon>';
            } 

            chipwrapprev.appendChild(chipTag);
        });
    } else {
        AllAddedChip.split(',').forEach(tag => {
            if (tag.trim() !== '') {
            let chipTag = document.createElement('md-assist-chip');
            chipTag.setAttribute('label', tag.trim());

            if (chipTag.label.toLowerCase() === 'important' ||chipTag.label.toLowerCase() === 'star') {
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>star</md-icon>';
            } else if(chipTag.label.toLowerCase() === 'fav' ||chipTag.label.toLowerCase() === 'favorite'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>favorite</md-icon>';
            } else if(chipTag.label.toLowerCase() === 'link' ||chipTag.label.toLowerCase() === 'links'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>link</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'list' ||chipTag.label.toLowerCase() === 'lists'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>list</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'cook' ||chipTag.label.toLowerCase() === 'cooking'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>cooking</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'work' ||chipTag.label.toLowerCase() === 'working'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>work</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'todo' ||chipTag.label.toLowerCase() === 'todos'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>task_alt</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'idea' ||chipTag.label.toLowerCase() === 'ideas'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>lightbulb</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'search' ||chipTag.label.toLowerCase() === 'searching'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>manage_search</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'Reminder' ||chipTag.label.toLowerCase() === 'Reminders' || chipTag.label.toLowerCase() === 'Remind'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>notifications_active</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'shop' ||chipTag.label.toLowerCase() === 'shopping list'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>shopping_cart</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'health' ||chipTag.label.toLowerCase() === 'healthy'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>health_and_safety</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'warm' ||chipTag.label.toLowerCase() === 'hot'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>local_fire_department</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'travel' ||chipTag.label.toLowerCase() === 'traveling'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>travel_explore</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'password' ||chipTag.label.toLowerCase() === 'passwords'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>password</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'safe' ||chipTag.label.toLowerCase() === 'save'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>private_connectivity</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'name' ||chipTag.label.toLowerCase() === 'names'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>id_card</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'wifi' ||chipTag.label.toLowerCase() === 'internet'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>wifi</md-icon>';
            } 

            chipwrapprev.appendChild(chipTag);
            }
        });
    
    }
} else{
    noteElement.setAttribute('NoTags', 'true')
}


    noteElement.classList.add('note');
    noteElement.innerHTML = `
        <h3>${heading}</h3>
        <p>${content}</p>
        <span class="date">${date}</span>
        <hiddenPrev style="display: none;">${AllAddedChip}</hiddenPrev>
        <md-divider style="margin-top: 10px; margin-bottom: 10px;"></md-divider>

        <menuButton>
         <button class="ripple-icon-btn regular" id="${menuIDRandom}" title='More options' ontouchstart="playEffect(this)"
          ontouchend="playEffect2(this)">
          <span class="ripple-effect-icon"></span>
          <span icon-outlined>more_vert</span>
        </button>
        </menuButton>

    `;


    noteElement.setAttribute('clickable', 'true');
    notesContainer.appendChild(noteElement);
    noteElement.appendChild(noteTouch)
    noteTouch.appendChild(noteRipple)
    noteRipple.attach(noteTouch)
    menuMainOptions.appendChild(deleteMenuBtn)
    menuMainOptions.appendChild(editMenuBtn)
    noteElement.appendChild(menuWrapper)
    menuWrapper.appendChild(menuMainOptions);
    noteElement.appendChild(chipwrapprev)

    const anchorEl = document.getElementById(menuIDRandom);
    const menuEl = document.getElementById(menuIDRandomMenu);

    anchorEl.addEventListener('click', () => { menuEl.open = !menuEl.open; });

    editMenuBtn.addEventListener('click', function () {
        editNote(noteElement, heading, content, date, AllAddedChip);
    });

    noteTouch.addEventListener('click', function () {
        viewNote(heading, contentToTextArea(content), AllAddedChip);
    });

    deleteMenuBtn.addEventListener('click', function () {
        if(document.getElementById('Always').checked){
        document.getElementById('confirmDeleteNoteDialog').show()
        dialogcolor()
        document.getElementById('deleteNoteOK').addEventListener('click', () =>{
            deleteNote(noteElement);
        });
    } else{
        deleteNote(noteElement);
    }
    });
}

function editNote(noteElement, initialHeading, initialContent, initialDate, initialChips) {
    const currentHeading = noteElement.querySelector('h3').textContent;
    const currentContent = noteElement.querySelector('p').innerHTML;



    saveNoteBtnEdit.hidden = false
    saveNoteBtn.hidden = true;

    document.getElementById('noteHeading').value = currentHeading;
    document.getElementById('noteContent').value = contentToTextArea(initialContent);

    
if(initialChips){

    if (Array.isArray(initialChips)) {
        initialChips.forEach(tag => {
            let chipTag = document.createElement('md-assist-chip');
            chipTag.setAttribute('label', tag.trim());

            if (chipTag.label.toLowerCase() === 'important' ||chipTag.label.toLowerCase() === 'star') {
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>star</md-icon>';
            } else if(chipTag.label.toLowerCase() === 'fav' ||chipTag.label.toLowerCase() === 'favorite'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>favorite</md-icon>';
            } else if(chipTag.label.toLowerCase() === 'link' ||chipTag.label.toLowerCase() === 'links'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>link</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'list' ||chipTag.label.toLowerCase() === 'lists'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>list</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'cook' ||chipTag.label.toLowerCase() === 'cooking'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>cooking</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'work' ||chipTag.label.toLowerCase() === 'working'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>work</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'todo' ||chipTag.label.toLowerCase() === 'todos'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>task_alt</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'idea' ||chipTag.label.toLowerCase() === 'ideas'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>lightbulb</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'search' ||chipTag.label.toLowerCase() === 'searching'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>manage_search</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'Reminder' ||chipTag.label.toLowerCase() === 'Reminders' || chipTag.label.toLowerCase() === 'Remind'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>notifications_active</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'shop' ||chipTag.label.toLowerCase() === 'shopping list'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>shopping_cart</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'health' ||chipTag.label.toLowerCase() === 'healthy'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>health_and_safety</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'warm' ||chipTag.label.toLowerCase() === 'hot'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>local_fire_department</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'travel' ||chipTag.label.toLowerCase() === 'traveling'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>travel_explore</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'password' ||chipTag.label.toLowerCase() === 'passwords'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>password</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'safe' ||chipTag.label.toLowerCase() === 'save'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>private_connectivity</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'name' ||chipTag.label.toLowerCase() === 'names'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>id_card</md-icon>';
            }else if(chipTag.label.toLowerCase() === 'wifi' ||chipTag.label.toLowerCase() === 'internet'){
                chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>wifi</md-icon>';
            } 

            document.getElementById('addedChips').appendChild(chipTag);

            chipTag.addEventListener('remove',()=>{
                let trimmedTag = tag.trim();
                console.log(trimmedTag);
                
                initialChips = initialChips.split(',').filter(t => t.trim() !== trimmedTag).join(',');
    
                initialChips = updatedChips.endsWith(',') ? updatedChips.slice(0, -1) : updatedChips;
    
        
                console.log('Updated initialChips:', initialChips);
            });
        });
    }else{

    initialChips.split(',').forEach(tag => {
        let chipTag = document.createElement('md-input-chip');
        chipTag.setAttribute('label', tag.trim());

        if (chipTag.label.toLowerCase() === 'important' ||chipTag.label.toLowerCase() === 'star') {
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>star</md-icon>';
        } else if(chipTag.label.toLowerCase() === 'fav' ||chipTag.label.toLowerCase() === 'favorite'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>favorite</md-icon>';
        } else if(chipTag.label.toLowerCase() === 'link' ||chipTag.label.toLowerCase() === 'links'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>link</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'list' ||chipTag.label.toLowerCase() === 'lists'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>list</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'cook' ||chipTag.label.toLowerCase() === 'cooking'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>cooking</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'work' ||chipTag.label.toLowerCase() === 'working'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>work</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'todo' ||chipTag.label.toLowerCase() === 'todos'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>task_alt</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'idea' ||chipTag.label.toLowerCase() === 'ideas'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>lightbulb</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'search' ||chipTag.label.toLowerCase() === 'searching'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>manage_search</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'Reminder' ||chipTag.label.toLowerCase() === 'Reminders' || chipTag.label.toLowerCase() === 'Remind'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>notifications_active</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'shop' ||chipTag.label.toLowerCase() === 'shopping list'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>shopping_cart</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'health' ||chipTag.label.toLowerCase() === 'healthy'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>health_and_safety</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'warm' ||chipTag.label.toLowerCase() === 'hot'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>local_fire_department</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'travel' ||chipTag.label.toLowerCase() === 'traveling'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>travel_explore</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'password' ||chipTag.label.toLowerCase() === 'passwords'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>password</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'safe' ||chipTag.label.toLowerCase() === 'save'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>private_connectivity</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'name' ||chipTag.label.toLowerCase() === 'names'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>id_card</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'wifi' ||chipTag.label.toLowerCase() === 'internet'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>wifi</md-icon>';
        } 

        document.getElementById('addedChips').appendChild(chipTag);
        
        chipTag.addEventListener('remove',()=>{
            let trimmedTag = tag.trim();
            console.log(trimmedTag);
            
            initialChips = initialChips.split(',').filter(t => t.trim() !== trimmedTag).join(',');

            initialChips = updatedChips.endsWith(',') ? updatedChips.slice(0, -1) : updatedChips;

    
            console.log('Updated initialChips:', initialChips);
        });
    });
}
}

    modal.hidden = false;

    setTimeout(() =>{
        document.getElementById('noteHeading').focus()
    }, 300);

    window.history.pushState({ AddNoteModalOpen: true }, "");

            document.getElementById('noteHeading').dispatchEvent(new Event('input'));
        document.getElementById('noteContent').dispatchEvent(new Event('input'));




    saveNoteBtnEdit.onclick = function () {



        const newHeading = document.getElementById('noteHeading').value;
        let newContent = document.getElementById('noteContent').value;

        const chipwrapprev = document.createElement('chipwrapprev')

        const AllNewAddedChips = document.getElementById('addedChips').querySelectorAll('md-input-chip');

    const AllNewchipsArray = []


        AllNewAddedChips.forEach((AllNewAddedChip) =>{

            AllNewchipsArray.push(AllNewAddedChip.getAttribute('UseAs'))
    
        });



        const cleanString = (initialChips + AllNewchipsArray).replace(/,+/g, ',').replace(/^,|,$/g, '');

        cleanString.split(',').forEach(tag => {
            if (tag.trim() !== '') {
                let chipTag = document.createElement('md-assist-chip');
                chipTag.setAttribute('label', tag.trim());


                if (chipTag.label.toLowerCase() === 'important' ||chipTag.label.toLowerCase() === 'star') {
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>star</md-icon>';
                } else if(chipTag.label.toLowerCase() === 'fav' ||chipTag.label.toLowerCase() === 'favorite'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>favorite</md-icon>';
                } else if(chipTag.label.toLowerCase() === 'link' ||chipTag.label.toLowerCase() === 'links'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>link</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'list' ||chipTag.label.toLowerCase() === 'lists'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>list</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'cook' ||chipTag.label.toLowerCase() === 'cooking'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>cooking</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'work' ||chipTag.label.toLowerCase() === 'working'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>work</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'todo' ||chipTag.label.toLowerCase() === 'todos'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>task_alt</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'idea' ||chipTag.label.toLowerCase() === 'ideas'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>lightbulb</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'search' ||chipTag.label.toLowerCase() === 'searching'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>manage_search</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'Reminder' ||chipTag.label.toLowerCase() === 'Reminders' || chipTag.label.toLowerCase() === 'Remind'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>notifications_active</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'shop' ||chipTag.label.toLowerCase() === 'shopping list'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>shopping_cart</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'health' ||chipTag.label.toLowerCase() === 'healthy'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>health_and_safety</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'warm' ||chipTag.label.toLowerCase() === 'hot'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>local_fire_department</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'travel' ||chipTag.label.toLowerCase() === 'traveling'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>travel_explore</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'password' ||chipTag.label.toLowerCase() === 'passwords'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>password</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'safe' ||chipTag.label.toLowerCase() === 'save'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>private_connectivity</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'name' ||chipTag.label.toLowerCase() === 'names'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>id_card</md-icon>';
                }else if(chipTag.label.toLowerCase() === 'wifi' ||chipTag.label.toLowerCase() === 'internet'){
                    chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>wifi</md-icon>';
                } 
 

                chipwrapprev.appendChild(chipTag);

            } else{
            }
        });


        if(cleanString.length === 0){
            noteElement.setAttribute('NoTags', 'true')
                
            }


        const menuIDRandom = 'Menu-' + Date.now();
    const menuIDRandomMenu = 'MenuAnchor-' + Date.now();

    const menuWrapper = document.createElement('WrapMenu');
    

    const noteRipple = document.createElement('md-ripple')
    const noteTouch = document.createElement('note-touch')
    noteRipple.style = '--md-ripple-pressed-opacity: 0.13;'

    const menuMainOptions = document.createElement('md-menu');
    menuMainOptions.setAttribute('positioning', 'popover');
    menuMainOptions.id = menuIDRandomMenu;
    menuMainOptions.setAttribute('anchor', menuIDRandom);
    menuMainOptions.setAttribute('anchor-corner', 'start-start');

    // menu-btns
    const deleteMenuBtn = document.createElement('md-menu-item')
    deleteMenuBtn.setAttribute('menu-type', '')
    deleteMenuBtn.innerHTML = `<div slot="headline">Delete</div>`

    const editMenuBtn = document.createElement('md-menu-item')
    editMenuBtn.setAttribute('menu-type', '')
    editMenuBtn.innerHTML = `<div slot="headline">Edit</div>`;

        if (newHeading.trim() === '' || newContent.trim() === '') {
            showSnackbarAction({
                text: 'Please enter both heading and note content',
                actionText: 'OK',
                bottomPosition: '2',
                manualDismiss: false,
                timeout: 3000,
                onActionClick: function (element) {

                }

            });
            return;
        }

        newContent = linkifyPreview(newContent);

        noteElement.innerHTML = `
            <h3>${newHeading}</h3>
            <p>${newContent}</p>
            <span class="date">${initialDate}</span>
                    <hiddenPrev style="display: none;">${cleanString}</hiddenPrev>
        <md-divider style="margin-top: 10px; margin-bottom: 10px;"></md-divider>
           <menuButton>
         <button class="ripple-icon-btn regular" id="${menuIDRandom}" title='More options' ontouchstart="playEffect(this)"
          ontouchend="playEffect2(this)">
          <span class="ripple-effect-icon"></span>
          <span icon-outlined>more_vert</span>
        </button>
        </menuButton>
        `;


      

        saveNotesToLocalStorage();
        window.history.back()

        setTimeout(() =>{
            document.getElementById('addedChips').innerHTML = ''
        }, 300);

        notesContainer.innerHTML = ''





        setTimeout(() =>{
            saveNoteBtnEdit.hidden = true
            saveNoteBtn.hidden = false;
            document.getElementById('noteHeading').value = '';
            document.getElementById('noteContent').value = '';
            initializeNotes()
        }, 100);


        noteElement.setAttribute('clickable', 'true');
        noteElement.appendChild(noteTouch)
        noteTouch.appendChild(noteRipple)
        noteRipple.attach(noteTouch)
        menuMainOptions.appendChild(deleteMenuBtn)
        menuMainOptions.appendChild(editMenuBtn)
        noteElement.appendChild(menuWrapper)
        menuWrapper.appendChild(menuMainOptions);
         noteElement.appendChild(chipwrapprev)


        const anchorEl = document.getElementById(menuIDRandom);
        const menuEl = document.getElementById(menuIDRandomMenu);
    
        anchorEl.addEventListener('click', () => { menuEl.open = !menuEl.open; });

        editMenuBtn.addEventListener('click', function () {
            editNote(noteElement, newHeading, newContent, );
        });

        noteTouch.addEventListener('click', function () {
            viewNote(newHeading, contentToTextArea(newContent), cleanString);
        });

        deleteMenuBtn.addEventListener('click', function () {
            if(document.getElementById('Always').checked){
            document.getElementById('confirmDeleteNoteDialog').show()
            dialogcolor()
            document.getElementById('deleteNoteOK').addEventListener('click', () =>{
                deleteNote(noteElement);
            });
        } else{
            deleteNote(noteElement);
        }
        });
    };

    ActivityColor()

}



function viewNote(heading, content, chipsTags) {

    document.getElementById('viewNoteModal').hidden = false;
    document.getElementById('ViewnoteHeading').innerHTML = '<pre>' + heading + '</pre>';
    document.getElementById('ViewnoteContent').innerHTML = '<pre>' + linkify(content) + '</pre>';
    window.history.pushState({ ViewNoteModalOpen: true }, "");

let chipsContainer  = document.getElementById('addedChipsView');


if(chipsTags){


if (Array.isArray(chipsTags)) {
    chipsTags.forEach(tag => {
        let chipTag = document.createElement('md-assist-chip');
        chipTag.setAttribute('label', tag.trim());
        chipsContainer.appendChild(chipTag);
        if (chipTag.label.toLowerCase() === 'important' ||chipTag.label.toLowerCase() === 'star') {
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>star</md-icon>';
        } else if(chipTag.label.toLowerCase() === 'fav' ||chipTag.label.toLowerCase() === 'favorite'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>favorite</md-icon>';
        } else if(chipTag.label.toLowerCase() === 'link' ||chipTag.label.toLowerCase() === 'links'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>link</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'list' ||chipTag.label.toLowerCase() === 'lists'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>list</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'cook' ||chipTag.label.toLowerCase() === 'cooking'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>cooking</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'work' ||chipTag.label.toLowerCase() === 'working'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>work</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'todo' ||chipTag.label.toLowerCase() === 'todos'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>task_alt</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'idea' ||chipTag.label.toLowerCase() === 'ideas'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>lightbulb</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'search' ||chipTag.label.toLowerCase() === 'searching'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>manage_search</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'Reminder' ||chipTag.label.toLowerCase() === 'Reminders' || chipTag.label.toLowerCase() === 'Remind'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>notifications_active</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'shop' ||chipTag.label.toLowerCase() === 'shopping list'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>shopping_cart</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'health' ||chipTag.label.toLowerCase() === 'healthy'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>health_and_safety</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'warm' ||chipTag.label.toLowerCase() === 'hot'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>local_fire_department</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'travel' ||chipTag.label.toLowerCase() === 'traveling'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>travel_explore</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'password' ||chipTag.label.toLowerCase() === 'passwords'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>password</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'safe' ||chipTag.label.toLowerCase() === 'save'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>private_connectivity</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'name' ||chipTag.label.toLowerCase() === 'names'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>id_card</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'wifi' ||chipTag.label.toLowerCase() === 'internet'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>wifi</md-icon>';
        } 
        
        
        
    });
} else {
    chipsTags.split(',').forEach(tag => {
        if (tag.trim() !== '') {
        let chipTag = document.createElement('md-assist-chip');
        chipTag.setAttribute('label', tag.trim());

        if (chipTag.label.toLowerCase() === 'important' ||chipTag.label.toLowerCase() === 'star') {
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>star</md-icon>';
        } else if(chipTag.label.toLowerCase() === 'fav' ||chipTag.label.toLowerCase() === 'favorite'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>favorite</md-icon>';
        } else if(chipTag.label.toLowerCase() === 'link' ||chipTag.label.toLowerCase() === 'links'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>link</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'list' ||chipTag.label.toLowerCase() === 'lists'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>list</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'cook' ||chipTag.label.toLowerCase() === 'cooking'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>cooking</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'work' ||chipTag.label.toLowerCase() === 'working'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>work</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'todo' ||chipTag.label.toLowerCase() === 'todos'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>task_alt</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'idea' ||chipTag.label.toLowerCase() === 'ideas'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>lightbulb</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'search' ||chipTag.label.toLowerCase() === 'searching'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>manage_search</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'Reminder' ||chipTag.label.toLowerCase() === 'Reminders' || chipTag.label.toLowerCase() === 'Remind'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>notifications_active</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'shop' ||chipTag.label.toLowerCase() === 'shopping list'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>shopping_cart</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'health' ||chipTag.label.toLowerCase() === 'healthy'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>health_and_safety</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'warm' ||chipTag.label.toLowerCase() === 'hot'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>local_fire_department</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'travel' ||chipTag.label.toLowerCase() === 'traveling'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>travel_explore</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'password' ||chipTag.label.toLowerCase() === 'passwords'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>password</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'safe' ||chipTag.label.toLowerCase() === 'save'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>private_connectivity</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'name' ||chipTag.label.toLowerCase() === 'names'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>id_card</md-icon>';
        }else if(chipTag.label.toLowerCase() === 'wifi' ||chipTag.label.toLowerCase() === 'internet'){
            chipTag.innerHTML = '<md-icon slot="icon" icon-outlined>wifi</md-icon>';
        } 
        
        chipsContainer.appendChild(chipTag);
        }
    });

}
}
    ActivityColor()

}

function deleteNote(noteElement) {
    
    noteElement.style.opacity = '0';
    noteElement.style.transform = 'translateX(-100%)';

    ShowSnack('Note was deleted', 3000, 2, 'fixed', 'tab-content-0', 'fab_1', '', fortab = true)

    setTimeout(() =>{
        notesContainer.removeChild(noteElement);
        saveNotesToLocalStorage();
    }, 300);

}

document.getElementById('confirmDeleteNoteDialog').addEventListener('close', () =>{
    checkTHEME()
});

const linkBtnType = localStorage.getItem('LinkButtonType')

function linkify(text) {
    
if(convertLinksToButtonToggle.selected){
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urlRegex = new RegExp(urlPattern, 'g');
    return text.replace(urlRegex, (url) => {
        const hostname = new URL(url).hostname;

        if(document.querySelector('[value="filled"]').selected){

            if(ShortUrlButtonToggle.selected){
            return `<md-filled-button class="noteUrlButton" href="${url}">${hostname}</md-filled-button>`;} else{
                return `<md-filled-button class="noteUrlButton" href="${url}">${url}</md-filled-button>`;
            }

        } else if(document.querySelector('[value="outlined"]').selected){

            if(ShortUrlButtonToggle.selected){
                return `<md-outlined-button class="noteUrlButton" href="${url}">${hostname}</md-outlined-button>`;
            } else{
                return `<md-outlined-button class="noteUrlButton" href="${url}">${url}</md-outlined-button>`;
            }

        } else{

            if(ShortUrlButtonToggle.selected){
                return `<md-filled-tonal-button class="noteUrlButton" href="${url}">${hostname}</md-filled-tonal-button>`;
            } else{
                return `<md-filled-tonal-button class="noteUrlButton" href="${url}">${url}</md-filled-tonal-button>`;
            }

        }
    });

} else{
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urlRegex = new RegExp(urlPattern, 'g');
    return text.replace(urlRegex, (url) => ` <a href="${url}">${url}</a> `);
}

}


function linkifyPreview(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urlRegex = new RegExp(urlPattern, 'g');
    return text.replace(urlRegex, (url) => ` <a href="${url}">${url}</a> `);
}


function contentToTextArea(htmlContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.innerText;
}



document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('noteHeading');

    textarea.addEventListener('input', function() {
        if (this.value === '') {
            this.style.height = '';
            this.style.maxHeight = '50px';
        } else {
            this.style.height = 'auto';

            this.style.height = this.scrollHeight + 'px';
            this.style.maxHeight = this.scrollHeight + 'px';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('noteContent');

    textarea.addEventListener('input', function() {
        if (this.value === '') {
            this.style.height = '';
            this.style.maxHeight = '50px';
        } else {
            this.style.height = 'auto';

            this.style.height = this.scrollHeight + 'px';
            this.style.maxHeight = this.scrollHeight + 'px';
        }
    });
});


function closeViewNoteModal() {
    document.getElementById('viewNoteModal').style.opacity = '0'

    checkTHEME()



    if(addLabelDialog.open){
        addLabelDialog.close()
    }

    setTimeout(() => {
        document.getElementById('viewNoteModal').hidden = true;
        document.getElementById('viewNoteModal').style.opacity = '';
            document.getElementById('ViewnoteHeading').style = '';
    document.getElementById('ViewnoteContent').style = '';
    }, 250);
}

window.addEventListener('popstate', function (event) {
    if(!document.getElementById('viewNoteModal').hidden){
    closeViewNoteModal()
    document.getElementById('addedChipsView').innerHTML = ''
}
});



initializeNotes()


// add label


const addLabelDialog = document.getElementById('addLabelDialog');
const addNewLabelFab = document.getElementById('addNewLabelFab');
const SaveCreatedLabel = document.getElementById('SaveCreatedLabel');
const NameLabelInputAdd = document.getElementById('NameLabelInputAdd');
const addedLabelsContainer = document.getElementById('addedLabelsContainer');
const deleteSelectedLabelBtn = document.getElementById('deleteSelectedLabelBtn');

addNewLabelFab.addEventListener('click', () =>{
    addLabelDialog.show();
    dialogcolorFull();
});


addLabelDialog.addEventListener('close', () =>{
    setTimeout(() =>{
        NameLabelInputAdd.value = '';
        NameLabelInputAdd.dispatchEvent(new Event('input'));

    }, 500);
    ActivityColor()
});


function ShowHideSaveNewLabelBtn() {
    if (NameLabelInputAdd.value.trim() === "") {
        SaveCreatedLabel.disabled = true;
    } else {
        SaveCreatedLabel.disabled = false;
    }
}

NameLabelInputAdd.addEventListener('input', ShowHideSaveNewLabelBtn);




SaveCreatedLabel.addEventListener('click', () =>{
    createNewLabel(NameLabelInputAdd.value);
});

document.addEventListener('DOMContentLoaded', function () {
    loadNotesLabelsFromLocalStorage();
});

function createNewLabel(label, fromLocalStorage = false){
    const addedLabelItem = document.createElement('addedLabelItem');
    addedLabelItem.innerHTML = `
        <md-checkbox class="NotesLabelCheckboxes"></md-checkbox>
        <p>${label}</p>
    `;

    addedLabelsContainer.appendChild(addedLabelItem)

    if (!fromLocalStorage) {
        saveNotesLabelToLocalStorage(label);
    }

    const checkbox = addedLabelItem.querySelector('.NotesLabelCheckboxes');
            checkbox.addEventListener('change', updateDeleteButtonState);

}

function saveNotesLabelToLocalStorage(label) {
    let Noteslabels = JSON.parse(localStorage.getItem('Noteslabels')) || [];
    Noteslabels.push(label);
    localStorage.setItem('Noteslabels', JSON.stringify(Noteslabels));
    updateDeleteButtonState()

    if(Noteslabels.length > 0){
        document.getElementById('mark_4').hidden = true;
    } else{
        document.getElementById('mark_4').hidden = false;

    }
}


function loadNotesLabelsFromLocalStorage() {
    let labels = JSON.parse(localStorage.getItem('Noteslabels')) || [];
    labels.forEach(label => createNewLabel(label, true));

    updateDeleteButtonState()

    if(labels.length > 0){
        document.getElementById('mark_4').hidden = true;
    } else{
        document.getElementById('mark_4').hidden = false;

    }
}

function loadNotesLabelForAddDialog(){
    let labels = JSON.parse(localStorage.getItem('Noteslabels')) || [];
    labels.forEach(labelDialogItem => createLabelInDialog(labelDialogItem));

    if(labels.length > 0){
        document.getElementById('mark_5').hidden = true;
    } else{
        CreatelabelItems.innerHTML = ''
        document.getElementById('mark_5').hidden = false;

    }
}

deleteSelectedLabelBtn.addEventListener('click', function () {
    const checkboxes = document.querySelectorAll('.NotesLabelCheckboxes');
    const labelsToKeep = [];
    
    checkboxes.forEach((checkbox, index) => {

        if (!checkbox.checked) {
            labelsToKeep.push(checkbox.nextElementSibling.innerText);
        } else {
            checkbox.parentElement.style.opacity = '0.4';
            checkbox.parentElement.style.transform = 'translateX(-110%)';

            setTimeout(() =>{
                checkbox.parentElement.remove();
             updateDeleteButtonState()
            }, 250);
        }

    });

    localStorage.setItem('Noteslabels', JSON.stringify(labelsToKeep));

    let savedLabels = JSON.parse(localStorage.getItem('Noteslabels')) || [];


    setTimeout(() =>{
        if(savedLabels.length > 0){
            document.getElementById('mark_4').hidden = true;
        } else{
            document.getElementById('mark_4').hidden = false;
        }
    }, 350);


    updateDeleteButtonState()
});





function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll('.NotesLabelCheckboxes');
    const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);


        deleteSelectedLabelBtn.hidden = !isAnyChecked;
}

// add labels to notes

const addLabelToCurrentNoteFab = document.getElementById('addLabelToCurrentNoteFab');
const SelectLabelsToAddDialog = document.getElementById('SelectLabelsToAddDialog');
const CreatelabelItems = document.getElementById('CreatelabelItems')
const addSelectedLabelToNoteBtn = document.getElementById('addSelectedLabelToNoteBtn');
const labelArea = document.getElementById('labelArea');

addLabelToCurrentNoteFab.addEventListener('click', () =>{
    SelectLabelsToAddDialog.show();
    loadNotesLabelForAddDialog()
    dialogcolorFull();
});

SelectLabelsToAddDialog.addEventListener('close', () =>{
    ActivityColor() 
});

SelectLabelsToAddDialog.addEventListener('closed', () =>{
    CreatelabelItems.innerHTML = ''
    addSelectedLabelToNoteBtn.disabled = true
});

function createLabelInDialog(labelDialogItem){
    const AddlabelToNoteItem = document.createElement('LabelItemNote');
    const AddlabelToNoteItemCheckbox = document.createElement('md-checkbox');
    AddlabelToNoteItemCheckbox.classList.add('AddlabelToNotesCheckbox') 
    const AddlabelToNoteItemTextContent = document.createElement('p');

    AddlabelToNoteItemTextContent.innerHTML = labelDialogItem;
    AddlabelToNoteItemCheckbox.setAttribute('value', labelDialogItem) 

    CreatelabelItems.appendChild(AddlabelToNoteItem)
    AddlabelToNoteItem.appendChild(AddlabelToNoteItemCheckbox);
    AddlabelToNoteItem.appendChild(AddlabelToNoteItemTextContent);


    const SelectLabelForNotecheckbox = AddlabelToNoteItem.querySelector('.AddlabelToNotesCheckbox');
    SelectLabelForNotecheckbox.addEventListener('change', updateAddLabelToNoteButtonState);

}

function updateAddLabelToNoteButtonState() {
    const checkboxes = document.querySelectorAll('.AddlabelToNotesCheckbox');
    const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);


    addSelectedLabelToNoteBtn.disabled = !isAnyChecked;
}

addSelectedLabelToNoteBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.AddlabelToNotesCheckbox');
    const selectedLabels = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    


    selectedLabels.forEach(label => {
        const labelChip = document.createElement('md-input-chip');
        labelChip.setAttribute('label', label);
        labelChip.setAttribute('UseAs', label);

        if (labelChip.label.toLowerCase() === 'important' ||labelChip.label.toLowerCase() === 'star') {
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>star</md-icon>';
        } else if(labelChip.label.toLowerCase() === 'fav' ||labelChip.label.toLowerCase() === 'favorite'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>favorite</md-icon>';
        } else if(labelChip.label.toLowerCase() === 'link' ||labelChip.label.toLowerCase() === 'links'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>link</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'list' ||labelChip.label.toLowerCase() === 'lists'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>list</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'cook' ||labelChip.label.toLowerCase() === 'cooking'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>cooking</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'work' ||labelChip.label.toLowerCase() === 'working'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>work</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'todo' ||labelChip.label.toLowerCase() === 'todos'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>task_alt</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'idea' ||labelChip.label.toLowerCase() === 'ideas'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>lightbulb</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'search' ||labelChip.label.toLowerCase() === 'searching'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>manage_search</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'Reminder' ||labelChip.label.toLowerCase() === 'Reminders' || labelChip.label.toLowerCase() === 'Remind'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>notifications_active</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'shop' ||labelChip.label.toLowerCase() === 'shopping list'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>shopping_cart</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'health' ||labelChip.label.toLowerCase() === 'healthy'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>health_and_safety</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'warm' ||labelChip.label.toLowerCase() === 'hot'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>local_fire_department</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'travel' ||labelChip.label.toLowerCase() === 'traveling'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>travel_explore</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'password' ||labelChip.label.toLowerCase() === 'passwords'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>password</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'safe' ||labelChip.label.toLowerCase() === 'save'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>private_connectivity</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'name' ||labelChip.label.toLowerCase() === 'names'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>id_card</md-icon>';
        }else if(labelChip.label.toLowerCase() === 'wifi' ||labelChip.label.toLowerCase() === 'internet'){
            labelChip.innerHTML = '<md-icon slot="icon" icon-outlined>wifi</md-icon>';
        } 

        document.getElementById('addedChips').appendChild(labelChip);
    });
});
