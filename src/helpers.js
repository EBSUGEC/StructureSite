export const getRDFFrValue = data => data.find(l => l["@language"] === "fr")["@value"]

export const filterNodes = (nodes, search, searchTags) => {
    const filteredNodes = nodes.filter(node => {
        /* Filter articles based on current research and if tags are selected*/
        const {title, tags, abstract} = node.frontmatter
        const nodeTags = tags ? tags : []
        const nodeText = abstract ? abstract : node.excerpt
        
        // remove nodes that are describing main pages 
        if(node.fields.slug === ""){
            return false
        }
        
        // is search is set, and if search is not in the tags nor the title nor the abstract
        if(search.trim().toLowerCase() !== "" && (nodeTags.indexOf(search) === -1 && title.toLowerCase().indexOf(search) === -1 && nodeText.toLowerCase().indexOf(search) === -1)){
            return false
        }
        
        // if no search tags selected, keep the node
        if(searchTags.length === 0){
            return true
        }
        
        // at least one selected search tag must be in the article tags (OR logic)
        for(let sTag of searchTags){
            if(nodeTags.indexOf(sTag) !== -1){
                return true
            }
        }
        
        return false
    })
    
    // Sort by number of matching tags (descending)
    return filteredNodes.sort((a, b) => {
        const tagsA = a.frontmatter.tags || []
        const tagsB = b.frontmatter.tags || []
        
        const matchesA = searchTags.filter(sTag => tagsA.indexOf(sTag) !== -1).length
        const matchesB = searchTags.filter(sTag => tagsB.indexOf(sTag) !== -1).length
        
        return matchesB - matchesA // descending order
    })
}


export const isDateOnCallendar = ({calendarDate, eventDate}) => {
    const isoDate = new Date(calendarDate.getTime() - (calendarDate.getTimezoneOffset() * 60000)).toISOString();
    return isoDate.split('T')[0] === eventDate
}