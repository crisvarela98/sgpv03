document.addEventListener('DOMContentLoaded', function() {
    // Mostrar la hora actual en el header
    function updateTime() {
        const now = new Date();
        const options = { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = now.toLocaleTimeString('es-AR', options);
        document.getElementById('time').textContent = timeString;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // Mostrar mensaje de bienvenida
    const username = localStorage.getItem('usuario');
    document.getElementById('welcome-message').textContent = `Bienvenido, @${username}!`;

    // Funcionalidad de logout
    document.getElementById('logout-button').addEventListener('click', function() {
        alert('Sesión cerrada');
        window.location.href = 'login.html';
    });
});

// Cargar notas del LS
window.onload = loadNotes;

function loadNotes() {
    const notesContainer = document.querySelector('.notes');
    notesContainer.innerHTML = ''; 

    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerHTML = `${note.text} <br><small>${note.timestamp}</small>`;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Eliminar';
        deleteBtn.onclick = () => deleteNote(index);
        noteDiv.appendChild(deleteBtn);

        notesContainer.appendChild(noteDiv);
    });
}

// Abrir y cerrar el popup
const popup = document.querySelector('.popup');
const openPopupBtn = document.querySelector('.open-popup');
const closePopupBtn = document.querySelector('.close-popup');

openPopupBtn.addEventListener('click', () => {
    loadNotes(); 
    popup.style.display = 'flex';
});

closePopupBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

document.querySelector('.note-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const noteText = document.querySelector('.note-input').value.trim();

    if (noteText !== "") {
        const now = new Date();
        const timestamp = now.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push({ text: noteText, timestamp: timestamp });
        localStorage.setItem('notes', JSON.stringify(notes));

        document.querySelector('.note-input').value = "";
        showMessage('Nota agregada con éxito');
        loadNotes(); // Recargar notas 
    }
});

function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes(); // Recargar notas 
}

function showMessage(message) {
    const messageDiv = document.querySelector('.message');
    messageDiv.innerText = message;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000); 
}
