var app = {
	list: document.getElementById('list'),
	title: document.getElementById('title'),
	content: document.getElementById('content'),
	noteId: 'null',
	init: () => {
		console.log('initializing...')
		app.listNotes()
		title.addEventListener('keyup', e => {
			e.key == 'Enter' ? content.focus() : setTimeout(() => {
				app.saveNote()
			}, 100)
		})
		content.addEventListener('keyup', e => {
			app.saveNote()
		})

	},
	newNote: () => {
		title.value = ''
		content.value = ''
		app.noteId = 'null'
		title.focus()
	},
	getNotes: id => {
		let allNotes = localStorage.getItem('notes');
		if (id) {
			return JSON.parse(allNotes).filter(note => {
				return note.id == id
			})
		} else {
			return allNotes ? JSON.parse(allNotes) : []
		}
	},
	listNotes: () => {
		let allNotes = app.getNotes()
		app.list.innerHTML = ''
		allNotesSorted = allNotes.sort((a, b) => {
			return (a.timestamp < b.timestamp) ? 1 : -1
			return 0;
		})
		allNotesSorted.forEach(note => {
			app.list.insertAdjacentHTML('beforeend', `<button class="note" tabindex="2" onclick="app.viewNote('${note.id}')" oncontextmenu="app.deleteNote('${note.id}');return false;"><h3>${note.title}</h3></button>`)
		})
	},
	viewNote: id => {
		let activeNote = app.getNotes(id)[0]
		app.noteId = activeNote.id
		app.title.value = activeNote.title
		app.content.value = activeNote.content
	},
	saveNote: () => {
		if (app.title.value.trim().length > 0 || app.content.value.trim().length > 0) {
			let obj = {
				id: (app.noteId !== 'null') ? app.noteId : `${Math.random().toString(36)}${Math.random()}`,
				timestamp: Date.now(),
				title: (app.title.value.trim().length > 0) ? app.title.value.trim() : `Note-${new Date().getFullYear()}${(new Date().getMonth()>9)? '':'0'}${new Date().getMonth()}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`,
				content: app.content.value.trim()
			}
			let oldNotes = app.getNotes()
			let newNotes = oldNotes
			if (app.noteId == 'null') {
				newNotes.push(obj)
				app.noteId = obj.id;
			}
			newNotes = newNotes.map(objx => {
				return (objx.id == obj.id) ? obj : objx
			})
			localStorage.setItem('notes', JSON.stringify(newNotes))
			app.listNotes()
		}
	},
	deleteNote: id => {
		let newNotes = app.getNotes()
		if (confirm(`Delete this note?`)) {
			newNotes = newNotes.filter(note => {
				return note.id !== id
			})
			localStorage.setItem('notes', JSON.stringify(newNotes))
			title.value = ''
			content.value = ''
			app.noteId = 'null'
			title.focus()
			app.listNotes()
		}
	}
}
document.addEventListener('DOMContentLoaded', e => {
	app.init()
})