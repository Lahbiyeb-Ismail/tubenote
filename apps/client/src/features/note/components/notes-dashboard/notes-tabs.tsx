// export function NotesTabs(){
//   return (
//     <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
//     <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
//       <TabsTrigger value="all" className="gap-2">
//         <MessageSquare className="h-4 w-4" />
//         All Notes ({sampleNotes.length})
//       </TabsTrigger>
//       <TabsTrigger value="pinned" className="gap-2">
//         <Pin className="h-4 w-4" />
//         Pinned ({sampleNotes.filter((n) => n.isPinned).length})
//       </TabsTrigger>
//       <TabsTrigger value="favorites" className="gap-2">
//         <Heart className="h-4 w-4" />
//         Favorites ({sampleNotes.filter((n) => n.isFavorite).length})
//       </TabsTrigger>
//       <TabsTrigger value="archived" className="gap-2">
//         <Archive className="h-4 w-4" />
//         Archived ({sampleNotes.filter((n) => n.isArchived).length})
//       </TabsTrigger>
//     </TabsList>

//     {/* Bulk Actions - moved inside Tabs but outside TabsContent */}
//     {selectedNotes.length > 0 && (
//       <div className="my-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Checkbox checked={selectedNotes.length === filteredNotes.length} onCheckedChange={handleSelectAll} />
//             <span className="text-sm font-medium">
//               {selectedNotes.length} note{selectedNotes.length !== 1 ? "s" : ""} selected
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" className="gap-1">
//               <Pin className="h-3 w-3" />
//               Pin
//             </Button>
//             <Button variant="outline" size="sm" className="gap-1">
//               <Archive className="h-3 w-3" />
//               Archive
//             </Button>
//             <Button variant="outline" size="sm" className="gap-1">
//               <Share className="h-3 w-3" />
//               Share
//             </Button>
//             <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700">
//               <Trash2 className="h-3 w-3" />
//               Delete
//             </Button>
//             <Button variant="ghost" size="sm" onClick={() => setSelectedNotes([])}>
//               <X className="h-3 w-3" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Notes Grid/List - now properly nested inside Tabs */}
//     <TabsContent value="all" className="mt-0">
//       {filteredNotes.length === 0 ? (
//         <Card className="border-slate-200 dark:border-slate-800">
//           <CardContent className="p-12 text-center">
//             <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No notes found</h3>
//             <p className="text-slate-600 dark:text-slate-400 mb-4">
//               {searchQuery || selectedCategory !== "All"
//                 ? "Try adjusting your search or filters"
//                 : "Start taking notes while watching videos to see them here"}
//             </p>
//             <Button className="gap-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700">
//               <Plus className="h-4 w-4" />
//               Create Your First Note
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div
//           className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
//         >
//           {filteredNotes.map((note) => (
//             <Card
//               key={note.id}
//               className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${getColorClasses(note.color)} ${
//                 selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""
//               }`}
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start gap-3 flex-1">
//                     <Checkbox
//                       checked={selectedNotes.includes(note.id)}
//                       onCheckedChange={() => handleSelectNote(note.id)}
//                       className="mt-1"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-2">
//                         {note.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
//                         {note.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
//                         {note.isArchived && <Archive className="h-4 w-4 text-slate-500" />}
//                       </div>
//                       <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
//                         {note.title}
//                       </h3>
//                       <div className="flex items-center gap-2 mt-2">
//                         <Badge variant="outline" className="text-xs">
//                           {note.category}
//                         </Badge>
//                         <div className="flex items-center gap-1 text-xs text-slate-500">
//                           <Clock className="h-3 w-3" />
//                           {note.timestamp}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <MoreVertical className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Eye className="mr-2 h-4 w-4" />
//                         View
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Edit className="mr-2 h-4 w-4" />
//                         Edit
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Pin className="mr-2 h-4 w-4" />
//                         {note.isPinned ? "Unpin" : "Pin"}
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Star className="mr-2 h-4 w-4" />
//                         {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem>
//                         <Archive className="mr-2 h-4 w-4" />
//                         {note.isArchived ? "Unarchive" : "Archive"}
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="text-red-600">
//                         <Trash2 className="mr-2 h-4 w-4" />
//                         Delete
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
//                   {note.content}
//                 </p>

//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
//                     <Youtube className="h-4 w-4 text-red-600" />
//                     <span className="text-sm font-medium truncate">{note.videoTitle}</span>
//                   </div>

//                   <div className="flex flex-wrap gap-1">
//                     {note.tags.map((tag, i) => (
//                       <Badge key={i} variant="secondary" className="text-xs">
//                         <Tag className="mr-1 h-2 w-2" />
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>

//                   <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                     <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
//                     <div className="flex items-center gap-2">
//                       <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
//                         <Video className="mr-1 h-3 w-3" />
//                         Jump to
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </TabsContent>

//     <TabsContent value="pinned" className="mt-0">
//       <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
//         {filteredNotes.filter((note) => note.isPinned).length === 0 ? (
//           <Card className="border-slate-200 dark:border-slate-800">
//             <CardContent className="p-12 text-center">
//               <Pin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold mb-2">No pinned notes</h3>
//               <p className="text-slate-600 dark:text-slate-400 mb-4">
//                 Pin important notes to access them quickly
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           filteredNotes
//             .filter((note) => note.isPinned)
//             .map((note) => (
//               <Card
//                 key={note.id}
//                 className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${getColorClasses(note.color)} ${
//                   selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""
//                 }`}
//               >
//                 {/* Same card content as above */}
//                 <CardHeader className="pb-3">
//                   {/* ... Card header content (same as above) ... */}
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <Checkbox
//                         checked={selectedNotes.includes(note.id)}
//                         onCheckedChange={() => handleSelectNote(note.id)}
//                         className="mt-1"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-2">
//                           {note.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
//                           {note.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
//                           {note.isArchived && <Archive className="h-4 w-4 text-slate-500" />}
//                         </div>
//                         <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
//                           {note.title}
//                         </h3>
//                         <div className="flex items-center gap-2 mt-2">
//                           <Badge variant="outline" className="text-xs">
//                             {note.category}
//                           </Badge>
//                           <div className="flex items-center gap-1 text-xs text-slate-500">
//                             <Clock className="h-3 w-3" />
//                             {note.timestamp}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         {/* ... Dropdown menu content (same as above) ... */}
//                         <DropdownMenuItem>
//                           <Eye className="mr-2 h-4 w-4" />
//                           View
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Edit className="mr-2 h-4 w-4" />
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Pin className="mr-2 h-4 w-4" />
//                           {note.isPinned ? "Unpin" : "Pin"}
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Star className="mr-2 h-4 w-4" />
//                           {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem>
//                           <Archive className="mr-2 h-4 w-4" />
//                           {note.isArchived ? "Unarchive" : "Archive"}
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="text-red-600">
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   {/* ... Card content (same as above) ... */}
//                   <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
//                     {note.content}
//                   </p>

//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
//                       <Youtube className="h-4 w-4 text-red-600" />
//                       <span className="text-sm font-medium truncate">{note.videoTitle}</span>
//                     </div>

//                     <div className="flex flex-wrap gap-1">
//                       {note.tags.map((tag, i) => (
//                         <Badge key={i} variant="secondary" className="text-xs">
//                           <Tag className="mr-1 h-2 w-2" />
//                           {tag}
//                         </Badge>
//                       ))}
//                     </div>

//                     <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                       <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
//                       <div className="flex items-center gap-2">
//                         <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
//                           <Video className="mr-1 h-3 w-3" />
//                           Jump to
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//         )}
//       </div>
//     </TabsContent>

//     <TabsContent value="favorites" className="mt-0">
//       <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
//         {filteredNotes.filter((note) => note.isFavorite).length === 0 ? (
//           <Card className="border-slate-200 dark:border-slate-800">
//             <CardContent className="p-12 text-center">
//               <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold mb-2">No favorite notes</h3>
//               <p className="text-slate-600 dark:text-slate-400 mb-4">Add notes to favorites to find them here</p>
//             </CardContent>
//           </Card>
//         ) : (
//           filteredNotes
//             .filter((note) => note.isFavorite)
//             .map((note) => (
//               <Card
//                 key={note.id}
//                 className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${getColorClasses(note.color)} ${
//                   selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""
//                 }`}
//               >
//                 {/* Same card content structure as above */}
//                 <CardHeader className="pb-3">
//                   {/* ... Card header content (same as above) ... */}
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <Checkbox
//                         checked={selectedNotes.includes(note.id)}
//                         onCheckedChange={() => handleSelectNote(note.id)}
//                         className="mt-1"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-2">
//                           {note.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
//                           {note.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
//                           {note.isArchived && <Archive className="h-4 w-4 text-slate-500" />}
//                         </div>
//                         <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
//                           {note.title}
//                         </h3>
//                         <div className="flex items-center gap-2 mt-2">
//                           <Badge variant="outline" className="text-xs">
//                             {note.category}
//                           </Badge>
//                           <div className="flex items-center gap-1 text-xs text-slate-500">
//                             <Clock className="h-3 w-3" />
//                             {note.timestamp}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         {/* ... Dropdown menu content (same as above) ... */}
//                         <DropdownMenuItem>
//                           <Eye className="mr-2 h-4 w-4" />
//                           View
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Edit className="mr-2 h-4 w-4" />
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Pin className="mr-2 h-4 w-4" />
//                           {note.isPinned ? "Unpin" : "Pin"}
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Star className="mr-2 h-4 w-4" />
//                           {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem>
//                           <Archive className="mr-2 h-4 w-4" />
//                           {note.isArchived ? "Unarchive" : "Archive"}
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="text-red-600">
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   {/* ... Card content (same as above) ... */}
//                   <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
//                     {note.content}
//                   </p>

//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
//                       <Youtube className="h-4 w-4 text-red-600" />
//                       <span className="text-sm font-medium truncate">{note.videoTitle}</span>
//                     </div>

//                     <div className="flex flex-wrap gap-1">
//                       {note.tags.map((tag, i) => (
//                         <Badge key={i} variant="secondary" className="text-xs">
//                           <Tag className="mr-1 h-2 w-2" />
//                           {tag}
//                         </Badge>
//                       ))}
//                     </div>

//                     <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                       <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
//                       <div className="flex items-center gap-2">
//                         <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
//                           <Video className="mr-1 h-3 w-3" />
//                           Jump to
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//         )}
//       </div>
//     </TabsContent>

//     <TabsContent value="archived" className="mt-0">
//       <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
//         {filteredNotes.filter((note) => note.isArchived).length === 0 ? (
//           <Card className="border-slate-200 dark:border-slate-800">
//             <CardContent className="p-12 text-center">
//               <Archive className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold mb-2">No archived notes</h3>
//               <p className="text-slate-600 dark:text-slate-400 mb-4">
//                 Archive notes you don't need right now but want to keep
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           filteredNotes
//             .filter((note) => note.isArchived)
//             .map((note) => (
//               <Card
//                 key={note.id}
//                 className={`group hover:shadow-lg transition-all duration-300 border-l-4 ${getColorClasses(note.color)} ${
//                   selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""
//                 }`}
//               >
//                 {/* Same card content structure as above */}
//                 <CardHeader className="pb-3">
//                   {/* ... Card header content (same as above) ... */}
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <Checkbox
//                         checked={selectedNotes.includes(note.id)}
//                         onCheckedChange={() => handleSelectNote(note.id)}
//                         className="mt-1"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-2">
//                           {note.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
//                           {note.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
//                           {note.isArchived && <Archive className="h-4 w-4 text-slate-500" />}
//                         </div>
//                         <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
//                           {note.title}
//                         </h3>
//                         <div className="flex items-center gap-2 mt-2">
//                           <Badge variant="outline" className="text-xs">
//                             {note.category}
//                           </Badge>
//                           <div className="flex items-center gap-1 text-xs text-slate-500">
//                             <Clock className="h-3 w-3" />
//                             {note.timestamp}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         {/* ... Dropdown menu content (same as above) ... */}
//                         <DropdownMenuItem>
//                           <Eye className="mr-2 h-4 w-4" />
//                           View
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Edit className="mr-2 h-4 w-4" />
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Pin className="mr-2 h-4 w-4" />
//                           {note.isPinned ? "Unpin" : "Pin"}
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Star className="mr-2 h-4 w-4" />
//                           {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem>
//                           <Archive className="mr-2 h-4 w-4" />
//                           {note.isArchived ? "Unarchive" : "Archive"}
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="text-red-600">
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   {/* ... Card content (same as above) ... */}
//                   <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
//                     {note.content}
//                   </p>

//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
//                       <Youtube className="h-4 w-4 text-red-600" />
//                       <span className="text-sm font-medium truncate">{note.videoTitle}</span>
//                     </div>

//                     <div className="flex flex-wrap gap-1">
//                       {note.tags.map((tag, i) => (
//                         <Badge key={i} variant="secondary" className="text-xs">
//                           <Tag className="mr-1 h-2 w-2" />
//                           {tag}
//                         </Badge>
//                       ))}
//                     </div>

//                     <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
//                       <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
//                       <div className="flex items-center gap-2">
//                         <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
//                           <Video className="mr-1 h-3 w-3" />
//                           Jump to
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//         )}
//       </div>
//     </TabsContent>
//   </Tabs>
//   )
// }
