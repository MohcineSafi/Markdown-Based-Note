
import React, { useState, useEffect } from 'react';
import { Trash2, Tag, Save, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [newTag, setNewTag] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setHasUnsavedChanges(false);
  }, [note]);

  useEffect(() => {
    const hasChanges = title !== note.title || content !== note.content;
    setHasUnsavedChanges(hasChanges);
  }, [title, content, note]);

  const extractTags = (text: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = text.match(tagRegex);
    return matches ? [...new Set(matches.map(tag => tag.substring(1)))] : [];
  };

  const saveNote = () => {
    const tags = extractTags(content);
    const updatedNote = {
      ...note,
      title: title.trim() || 'Untitled',
      content,
      tags,
      updatedAt: new Date()
    };
    onUpdate(updatedNote);
    setHasUnsavedChanges(false);
    toast({
      title: "Note saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const addTag = () => {
    if (newTag.trim() && !note.tags.includes(newTag.trim())) {
      const updatedContent = content + ` #${newTag.trim()}`;
      setContent(updatedContent);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedContent = content.replace(new RegExp(`#${tagToRemove}\\b`, 'g'), '').trim();
    setContent(updatedContent);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
      toast({
        title: "Note deleted",
        description: "The note has been permanently deleted.",
        variant: "destructive"
      });
    }
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveNote();
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, hasUnsavedChanges]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-none bg-transparent p-0 focus:ring-0 placeholder:text-slate-400"
            placeholder="Note title..."
          />
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1 text-orange-600 text-sm">
                <Clock className="w-4 h-4" />
                <span>Unsaved</span>
              </div>
            )}
            <Button onClick={saveNote} size="sm" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleDelete} size="sm" variant="destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-slate-500" />
          <div className="flex flex-wrap gap-2">
            {extractTags(content).map(tag => (
              <Badge 
                key={tag} 
                variant="outline"
                className="cursor-pointer hover:bg-red-50 hover:border-red-200"
                onClick={() => removeTag(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Add Tag */}
        <div className="flex gap-2">
          <Input
            placeholder="Add tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            className="text-sm"
          />
          <Button onClick={addTag} size="sm" variant="outline">
            Add Tag
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note in markdown..."
          className="h-full resize-none border-none focus:ring-0 text-base leading-relaxed font-mono"
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-sm text-slate-500">
        <div className="flex justify-between">
          <span>Created: {note.createdAt.toLocaleDateString()}</span>
          <span>Modified: {note.updatedAt.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
