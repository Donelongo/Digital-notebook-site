"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let fetcher = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        };
        let response = yield fetch("http://localhost:3000/notes", {
            method: "GET",
            headers: headersList
        });
        let data = yield response.text();
        JSON.parse(data).map((note) => { saveNote(note); });
        return data ? JSON.parse(data) : [];
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
});
let checkLogin = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Brave Browser (https://brave.com/)"
        };
        let response = yield fetch("http://localhost:3000/users/login", {
            method: "POST",
            headers: headersList,
            body: JSON.stringify({
                user_name: inputs.user_name,
                password: inputs.password,
                email: inputs.email
            })
        });
        let data = yield response.text();
        return data ? JSON.parse(data) : [];
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
});
function syncNotes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notes = getNotes();
            localStorage.setItem("backupNotes", JSON.stringify(notes));
            const response = yield fetch('http://localhost:3000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notes)
            });
            if (!response.ok) {
                throw new Error('Failed to backup notes');
            }
            console.log('Notes backed up successfully');
            yield fetcher();
        }
        catch (error) {
            console.error('Error backing up notes:', error);
        }
    });
}
function delete_online(note) {
    fetch(`http://localhost:3000/notes/${note.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete note');
        }
        console.log('Note deleted successfully');
    })
        .catch(error => {
        console.error('Error deleting note:', error);
    });
}
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        let username = document.querySelector('.userName');
        let password = document.querySelector('.password');
        let email = document.querySelector('.email');
        console.log(username.value, email.value, password.value);
        let res = yield fetch(`http://localhost:3000/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name: username.value,
                password: password.value,
                email: email.value,
            })
        });
        let data = yield res.json();
        console.log(data);
        if (data.loginStat) {
            localStorage.setItem('user', JSON.stringify('d1longo'));
            window.open('../index.html', '_self');
        }
        else {
            alert('wrong password');
            throw new Error('Failed to login');
        }
    });
}
// This works
function getNotes() {
    try {
        return JSON.parse(localStorage.getItem('notes'));
    }
    catch (error) {
        console.error('Error parsing notes:', error);
        return [];
    }
}
function deleteNote(element) {
    var _a;
    (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
    let notes = JSON.parse(localStorage.getItem('notes'));
    let deletedNote = null;
    notes = notes.filter((note) => {
        if (element.id !== `${note.id}`) {
            deletedNote = note;
            return true;
        }
        return false;
    });
    localStorage.setItem('notes', JSON.stringify(notes));
    if (deletedNote) {
        delete_online(deletedNote);
    }
}
function updateNote(id, content) {
    let notes = getNotes();
    const updatedNotes = notes.map(sNote => {
        if (sNote.id === id) {
            return Object.assign(Object.assign({}, sNote), { content: content });
        }
        else {
            return sNote;
        }
    });
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    // ! error here, extra note elements
    syncNotes();
}
function addNote() {
    let textArea = document.querySelector(".new-page-note");
    const NewNote = {
        id: Math.floor(Math.random() * 100000),
        content: textArea.value,
    };
    saveNote(NewNote);
    window.open('./notes.html', '_self');
}
function saveNote(note) {
    let savedNotes = getNotes();
    let exists = false;
    savedNotes.map(sNote => { note.id === sNote.id ? exists = true : null; });
    !exists ? localStorage.setItem("notes", JSON.stringify(savedNotes.concat(note))) : console.log('Note already exists');
}
function openNewNote() {
    window.open('./the-note.html', '_self');
}
// Function to update the note content in notes.html
function updateNoteContent(id, editedContent) {
    // Here you should update the note with the given ID in your notes list or display it in the UI
    // For example:
    const noteElement = document.querySelector(`[data-note-id="${id}"]`);
    noteElement.innerText = editedContent; // Update the content in the UI
    // You might also want to update the content in the localStorage if you're using it
    // localStorage.setItem(`note_${id}`, editedContent);
}
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        fetcher();
        if (!localStorage.getItem('notes') ||
            typeof JSON.parse(localStorage.getItem('notes')) !== 'object') {
            let data = yield fetcher();
            localStorage.setItem('notes', JSON.stringify(data ? data : []));
        }
        const saveBtn = document.querySelector(".save-note");
        saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.addEventListener('click', addNote);
        // *****************************************************************
        const addBtn = document.createElement('button');
        addBtn.classList.add('btn');
        addBtn.id = 'btn'; // Corrected the capitalization of 'Id' to 'id'
        addBtn.addEventListener('click', openNewNote); // Corrected the variable name from 'addbtn' to 'addBtn'
        addBtn.innerHTML = '+';
        // *****************************************************************
        const notesSection = document.querySelectorAll('.note-container')[0];
        let notes = getNotes();
        notes.map((note) => {
            // create div element with current note name and div type
            const currentNote = document.createElement('div');
            const textArea = document.createElement('textarea');
            const title = document.createElement('h1');
            const deleteBtn = document.createElement('button');
            title.innerHTML = note.title || 'Title';
            textArea.value = note.content;
            title.classList.add('title', 'note-title');
            textArea.classList.add('note-textarea');
            deleteBtn.classList.add('delete-btn');
            textArea.addEventListener('focusout', () => {
                updateNote(note.id, textArea.value);
            });
            deleteBtn.addEventListener("click", () => {
                deleteNote(currentNote);
            });
            title.addEventListener("dbclick", () => {
                deleteNote(currentNote);
            });
            currentNote.classList.add('note');
            currentNote.appendChild(title);
            currentNote.appendChild(deleteBtn);
            currentNote.appendChild(textArea);
            currentNote.id = `${note.id}`;
            // newNote.addEventListener('click', editNoteContent(`note${i}`));
            notesSection.appendChild(currentNote);
            return currentNote;
        });
        notesSection.appendChild(addBtn);
    });
};
