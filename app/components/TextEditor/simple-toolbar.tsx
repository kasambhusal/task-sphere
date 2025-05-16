"use client";

import type React from "react";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  TableIcon,
  ImageIcon,
  Type,
  Underline,
  Heading1,
  Heading2,
  Palette,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SimpleToolbarProps {
  editor: Editor | null;
}

const textColors = [
  { name: "Default", color: "inherit" },
  { name: "Black", color: "#000000" },
  { name: "White", color: "#ffffff" },
  { name: "Gray", color: "#4b5563" },
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Yellow", color: "#eab308" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Purple", color: "#a855f7" },
  { name: "Pink", color: "#ec4899" },
];

const backgroundColors = [
  { name: "Default", color: "inherit" },
  { name: "Black", color: "#000000" },
  { name: "White", color: "#ffffff" },
  { name: "Gray", color: "#f3f4f6" },
  { name: "Red", color: "#fee2e2" },
  { name: "Orange", color: "#ffedd5" },
  { name: "Yellow", color: "#fef9c3" },
  { name: "Green", color: "#dcfce7" },
  { name: "Blue", color: "#dbeafe" },
  { name: "Purple", color: "#f3e8ff" },
  { name: "Pink", color: "#fce7f3" },
];

export default function SimpleToolbar({ editor }: SimpleToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorType, setColorType] = useState<"text" | "background">("text");
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  if (!editor) {
    return null;
  }

  const setTextColor = (color: string) => {
    if (color === "inherit") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    setShowColorPicker(false);
  };

  const setBackgroundColor = (color: string) => {
    if (color === "inherit") {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
    setShowColorPicker(false);
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageMenu(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor.chain().focus().setImage({ src: reader.result }).run();
          setShowImageMenu(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setShowTableMenu(false);
  };

  return (
    <div className="editor-toolbar">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("paragraph")}
        onPressedChange={() => editor.chain().focus().setParagraph().run()}
      >
        <Type className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
        pressed={editor.isActive({ textAlign: "left" })}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
        pressed={editor.isActive({ textAlign: "center" })}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
        pressed={editor.isActive({ textAlign: "right" })}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Color Picker */}
      <div className="relative">
        <button
          className="editor-toolbar-button"
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setColorType("text");
          }}
        >
          <Palette className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Colors
          </span>
        </button>

        {showColorPicker && (
          <div className="editor-dropdown w-64">
            <div className="editor-dropdown-tabs">
              <button
                className={cn(
                  "editor-dropdown-tab",
                  colorType === "text" ? "active" : ""
                )}
                onClick={() => setColorType("text")}
              >
                Text Color
              </button>
              <button
                className={cn(
                  "editor-dropdown-tab",
                  colorType === "background" ? "active" : ""
                )}
                onClick={() => setColorType("background")}
              >
                Background
              </button>
            </div>

            <div className="editor-color-grid">
              {colorType === "text"
                ? textColors.map((item) => (
                    <button
                      key={item.name}
                      className={cn(
                        "editor-color-button",
                        item.color === "inherit" &&
                          "bg-gradient-to-br from-slate-100 to-slate-300"
                      )}
                      style={{
                        backgroundColor:
                          item.color !== "inherit" ? item.color : undefined,
                      }}
                      title={item.name}
                      onClick={() => setTextColor(item.color)}
                    />
                  ))
                : backgroundColors.map((item) => (
                    <button
                      key={item.name}
                      className={cn(
                        "editor-color-button",
                        item.color === "inherit" &&
                          "bg-gradient-to-br from-slate-100 to-slate-300"
                      )}
                      style={{
                        backgroundColor:
                          item.color !== "inherit" ? item.color : undefined,
                      }}
                      title={item.name}
                      onClick={() => setBackgroundColor(item.color)}
                    />
                  ))}
            </div>
          </div>
        )}
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Table Menu */}
      <div className="relative">
        <button
          className="editor-toolbar-button"
          onClick={() => setShowTableMenu(!showTableMenu)}
        >
          <TableIcon className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Insert Table
          </span>
        </button>

        {showTableMenu && (
          <div className="editor-dropdown w-80">
            <h4 className="font-medium mb-2">Insert Table</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Set the dimensions for your table.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="rows" className="editor-label">
                  Rows
                </label>
                <input
                  id="rows"
                  type="number"
                  min={2}
                  max={10}
                  value={rows}
                  onChange={(e) => setRows(Number.parseInt(e.target.value))}
                  className="editor-input"
                />
              </div>
              <div>
                <label htmlFor="cols" className="editor-label">
                  Columns
                </label>
                <input
                  id="cols"
                  type="number"
                  min={2}
                  max={10}
                  value={cols}
                  onChange={(e) => setCols(Number.parseInt(e.target.value))}
                  className="editor-input"
                />
              </div>
            </div>

            <button onClick={insertTable} className="editor-button">
              Insert Table
            </button>
          </div>
        )}
      </div>

      {/* Image Menu */}
      <div className="relative">
        <button
          className="editor-toolbar-button"
          onClick={() => setShowImageMenu(!showImageMenu)}
        >
          <ImageIcon className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Insert Image
          </span>
        </button>

        {showImageMenu && (
          <div className="editor-dropdown w-80">
            <h4 className="font-medium mb-2">Insert Image</h4>

            <div className="mb-4">
              <label htmlFor="image-url" className="editor-label">
                Image URL
              </label>
              <input
                id="image-url"
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="editor-input mb-2"
              />
              <button onClick={addImage} className="editor-button">
                Insert Image from URL
              </button>
            </div>

            <div className="border-t pt-4">
              <label htmlFor="image-upload" className="editor-label">
                Upload Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="editor-input"
              />
            </div>
          </div>
        )}
      </div>

      {editor.isActive("table") && (
        <>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <div className="editor-table-controls">
            <button
              className="editor-table-button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              Add Column Before
            </button>
            <button
              className="editor-table-button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              Add Column After
            </button>
            <button
              className="editor-table-button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              Add Row Before
            </button>
            <button
              className="editor-table-button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              Add Row After
            </button>
            <button
              className="editor-table-button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              Delete Column
            </button>
            <button
              className="editor-table-button"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              Delete Row
            </button>
            <button
              className="editor-table-button"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              Delete Table
            </button>
          </div>
        </>
      )}
    </div>
  );
}
