const PREFIX = "note_", COLOR_ID = "__notes_color", DEFAULT_COLOR = "#8bc34a";
Vue.filter("toLocaleDateString", function(value){
	return new Date(value).toLocaleDateString("en-US", {
		
	});
});
new Vue({
    el: "#appNotas",
    data: () => ({
        notes: [],
        color: DEFAULT_COLOR,
        newNote: {
            note: "",
        },
        editingNote: {},
    }),
    mounted() {
        this.getNotes();
        this.focusTextarea();
        this.color = localStorage.getItem(COLOR_ID) || DEFAULT_COLOR;
    },
    methods: {
        onColorChanged() {
            localStorage.setItem(COLOR_ID, this.color);
        },
        focusTextarea() {
            this.$refs.textarea.focus();
        },
        saveEditingNote() {
            if (!this.editingNote.note.trim()) return alert("Por favor escribe una nota!!");
						this.editingNote.time = new Date().getTime();
            localStorage.setItem(this.editingNote.id, JSON.stringify(Object.assign({}, this.editingNote)));
            this.cancelEdit();
            this.getNotes();
        },
        uuid() {
            return PREFIX + (function b(a) {
                return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b)
            }());
        },
        cancelEdit() {
            this.editingNote = {};
            this.focusTextarea();
        },
        editNote(note) {
            this.editingNote = Object.assign({}, note);
            this.$refs.textarea.scrollIntoView();
        },
        deleteNote(note) {
            if (!confirm(`Eliminar Definitivamente ${note.note}?`)) return;
            localStorage.removeItem(note.id);
            this.getNotes();
        },
        saveNote() {
            if (!this.newNote.note.trim()) return alert("Por favor escribe una nota!");
            let id = this.uuid();
            this.newNote.id = id;
						this.newNote.time = new Date().getTime();
            localStorage.setItem(id, JSON.stringify(Object.assign({}, this.newNote)));
            this.newNote.note = "";
            this.getNotes();
            this.focusTextarea();
        },
        getNotes() {
            this.notes = Object.keys(localStorage)
                .filter(key => key.startsWith(PREFIX))
                .map(key => JSON.parse(localStorage.getItem(key)));
						this.notes.sort((a, b) => b.time - a.time);
        }
    }
});