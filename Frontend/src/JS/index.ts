// Function to retrieve notes from localStorage
interface Note {
    id: number;
    content: string;
    title?: string
    owner?: string
}

interface inputs {
    user_name: string
    password: string
    email: string
}

let fetcher = async (): Promise<Note[]> => {
    try {
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        }
        let response = await fetch("http://localhost:3000/notes", { 
            method: "GET",
            headers: headersList
        });

        let data = await response.text();

        JSON.parse(data).map((note: Note) => {saveNote(note)})
        return data? JSON.parse(data): [];

    } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }
};

let checkLogin = async (inputs: inputs): Promise<Note[]> => {
    try {
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Brave Browser (https://brave.com/)"
        }

        let response = await fetch("http://localhost:3000/users/login", {
            method: "POST",
            headers: headersList,
            body: JSON.stringify({
                user_name: inputs.user_name,
                password: inputs.password,
                email: inputs.email
            })
        });

        let data = await response.text();
        return data? JSON.parse(data): [];

    } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
    }

}

async function syncNotes(): Promise<void> {
    try {
        const notes: Note[] = getNotes();
        localStorage.setItem("backupNotes", JSON.stringify(notes));

        const response = await fetch('http://localhost:3000/notes', {
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
        await fetcher();
    } catch (error) {
        console.error('Error backing up notes:', error);
    }
}

function delete_online(note: Note){
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

async function login() {
    let username = document.querySelector('.userName') as HTMLInputElement;
    let password = document.querySelector('.password') as HTMLInputElement;
    let email = document.querySelector('.email') as HTMLInputElement;

    console.log(username.value, email.value, password.value)

    let res = await fetch(`http://localhost:3000/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_name: username.value,
            password: password.value,
            email: email.value,
        })
    })

    let data = await res.json();
    console.log(data)
    if (data.loginStat){
        localStorage.setItem('user', JSON.stringify('d1longo'));
                window.open('../index.html', '_self');
    } else {
        alert('wrong password')
        throw new Error('Failed to login');
    }
}

// This works
function getNotes(): Note[] {
    try {
        return JSON.parse(localStorage.getItem('notes') as string);
    } catch (error) {
        console.error('Error parsing notes:', error);
        return [];
    }
}

function deleteNote(element: HTMLDivElement): void {
    element.parentNode?.removeChild(element);

    let notes: Note[] = JSON.parse(localStorage.getItem('notes') as string);
    let deletedNote: Note | null = null;
    notes = notes.filter((note: Note) => {
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

function updateNote(id: number, content: string): void {
    let notes: Note[] = getNotes();

    const updatedNotes = notes.map(sNote => {
        if (sNote.id === id) {
            return {
                ...sNote,
                content: content
            };
        } else {
            return sNote;
        }
    });

    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    // ! error here, extra note elements
    syncNotes()
}

function addNote(): void {
    let textArea: HTMLTextAreaElement = document.querySelector(".new-page-note") as HTMLTextAreaElement

    const NewNote: Note = {
        id: Math.floor(Math.random() * 100000),
        content: textArea.value,
    };

    saveNote(NewNote);
    window.open('./notes.html', '_self');
}

function saveNote(note: Note): void {

    let savedNotes: Note[] = getNotes();

    let exists = false
    savedNotes.map(sNote => {note.id === sNote.id? exists = true: null})

    !exists?localStorage.setItem("notes", JSON.stringify(savedNotes.concat(note))): console.log('Note already exists')
}

function openNewNote() {
    window.open('./the-note.html', '_self');
}

 // Function to update the note content in notes.html
function updateNoteContent(id: string, editedContent: string) {
    // Here you should update the note with the given ID in your notes list or display it in the UI
    // For example:
    const noteElement = document.querySelector(`[data-note-id="${id}"]`) as HTMLElement;
    noteElement.innerText = editedContent; // Update the content in the UI
    // You might also want to update the content in the localStorage if you're using it
    // localStorage.setItem(`note_${id}`, editedContent);
}

window.onload = async function () {

    fetcher();

    if(
        !localStorage.getItem('notes') ||
        typeof JSON.parse(localStorage.getItem('notes') as string) !== 'object'
        ){
        let data: Note[] = await fetcher()
        localStorage.setItem('notes', JSON.stringify(data? data: []))
    }

    const saveBtn = document.querySelector(".save-note")
    saveBtn?.addEventListener('click', addNote);

// *****************************************************************
    const addBtn = document.createElement('button');
    addBtn.classList.add('btn');
    addBtn.id = 'btn'; // Corrected the capitalization of 'Id' to 'id'
    addBtn.addEventListener('click', openNewNote); // Corrected the variable name from 'addbtn' to 'addBtn'
    addBtn.innerHTML = '+';

    // *****************************************************************

    const notesSection = document.querySelectorAll('.note-container')[0] as HTMLElement;

    let notes: Note[] = getNotes();

    notes.map((note: Note) => {
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
            updateNote(note.id, textArea.value)
        })

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

        return currentNote
    });

    notesSection.appendChild(addBtn);

};