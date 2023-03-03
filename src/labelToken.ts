static const tag_reg = /^#([devt])(?=\s)(.*|$)/
CodeMirror.extendMode('obsidian',{
    name:'modevol',
    token(stream, state) {
        stream.match(tag_reg)
    },
})