
import React, { useState, useEffect } from 'react';
import { Search, Plus, FolderPlus, Hash, FileText, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import NoteEditor from '@/components/NoteEditor';
import NotePreview from '@/components/NotePreview';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Folder {
  id: string;
  name: string;
  isExpanded: boolean;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'default', name: 'Notes', isExpanded: true }
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState('default');

  // Initialize with a sample note
  useEffect(() => {
    const sampleNote: Note = {
      id: '1',
      title: 'Welcome to Glimmer Notes',
      content: `# Welcome to Glimmer Notes! ✨

This is your new markdown-based note-taking app with powerful features:

## Features
- **Folders** for organizing your notes
- **Tags** for categorizing content
- **Search** across all your notes
- **Syntax highlighting** for code blocks
- **Live preview** of your markdown

## Getting Started
1. Create new folders using the + button next to folders
2. Add tags to your notes using #hashtags
3. Use the search bar to quickly find notes
4. Write in markdown and see live preview

## Code Example
\`\`\`javascript
function createNote(title, content) {
  return {
    id: generateId(),
    title,
    content,
    tags: extractTags(content),
    createdAt: new Date()
  };
}
\`\`\`

Happy note-taking! 📝`,
      folderId: 'default',
      tags: ['welcome', 'tutorial'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([sampleNote]);
    setSelectedNote(sampleNote);
  }, []);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '# New Note\n\nStart writing...',
      folderId: selectedFolderId,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        isExpanded: true
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, isExpanded: !folder.isExpanded }
        : folder
    ));
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getNotesInFolder = (folderId: string) => {
    return filteredNotes.filter(note => note.folderId === folderId);
  };

  const getAllTags = () => {
    const allTags = notes.flatMap(note => note.tags);
    return [...new Set(allTags)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 shadow-sm flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Glimmer Notes</h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={createNote} size="sm" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
            <Button 
              onClick={() => setIsCreatingFolder(true)} 
              variant="outline" 
              size="sm"
            >
              <FolderPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Folders and Notes */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Create Folder Input */}
          {isCreatingFolder && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                onBlur={() => {
                  if (!newFolderName.trim()) setIsCreatingFolder(false);
                }}
                autoFocus
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button onClick={createFolder} size="sm">Create</Button>
                <Button onClick={() => setIsCreatingFolder(false)} variant="outline" size="sm">Cancel</Button>
              </div>
            </div>
          )}

          {/* Folders */}
          {folders.map(folder => (
            <div key={folder.id} className="mb-4">
              <div 
                className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group"
                onClick={() => {
                  toggleFolder(folder.id);
                  setSelectedFolderId(folder.id);
                }}
              >
                {folder.isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
                <Folder className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-700 group-hover:text-slate-900">
                  {folder.name}
                </span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {getNotesInFolder(folder.id).length}
                </Badge>
              </div>

              {folder.isExpanded && (
                <div className="ml-6 mt-2 space-y-1">
                  {getNotesInFolder(folder.id).map(note => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        selectedNote?.id === note.id 
                          ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => setSelectedNote(note)}
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-800 truncate">
                            {note.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {note.content.replace(/[#*`]/g, '').substring(0, 100)}...
                          </p>
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {note.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                              {note.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{note.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Tags Section */}
          {getAllTags().length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-700">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getAllTags().map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-slate-100"
                      onClick={() => setSearchTerm(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {selectedNote ? (
          <>
            {/* Editor */}
            <div className="flex-1 border-r border-slate-200">
              <NoteEditor 
                note={selectedNote} 
                onUpdate={updateNote}
                onDelete={deleteNote}
              />
            </div>
            
            {/* Preview */}
            <div className="flex-1">
              <NotePreview note={selectedNote} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-600 mb-2">
                Select a note to get started
              </h2>
              <p className="text-slate-500 mb-4">
                Choose a note from the sidebar or create a new one
              </p>
              <Button onClick={createNote}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
