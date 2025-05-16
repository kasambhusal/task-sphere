"use client"

import type { Editor } from "@tiptap/react"
import { useState } from "react"

interface BasicToolbarProps {
  editor: Editor | null
}

export default function BasicToolbar({ editor }: BasicToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showTableMenu, setShowTableMenu] = useState(false)
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)

  if (!editor) {
    return null
  }

  const buttonStyle = {
    padding: "5px 10px",
    margin: "2px",
    border: "1px solid #ccc",
    background: "#f1f1f1",
    cursor: "pointer",
  }

  const activeButtonStyle = {
    ...buttonStyle,
    background: "#e1e1e1",
    borderColor: "#999",
  }

  const dropdownStyle = {
    position: "absolute" as const,
    zIndex: 1000,
    backgroundColor: "white",
    border: "1px solid #ccc",
    padding: "10px",
    marginTop: "2px",
    width: "250px",
  }

  const inputStyle = {
    width: "100%",
    padding: "5px",
    marginBottom: "10px",
    border: "1px solid #ccc",
  }

  const colorButtonStyle = {
    width: "20px",
    height: "20px",
    margin: "2px",
    border: "1px solid #ccc",
    display: "inline-block",
    cursor: "pointer",
  }

  const textColors = [
    { name: "Black", color: "#000000" },
    { name: "Red", color: "#ff0000" },
    { name: "Green", color: "#00ff00" },
    { name: "Blue", color: "#0000ff" },
    { name: "Yellow", color: "#ffff00" },
  ]

  const backgroundColors = [
    { name: "White", color: "#ffffff" },
    { name: "Light Red", color: "#ffcccc" },
    { name: "Light Green", color: "#ccffcc" },
    { name: "Light Blue", color: "#ccccff" },
    { name: "Light Yellow", color: "#ffffcc" },
  ]

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
    setShowColorPicker(false)
  }

  const setBackgroundColor = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run()
    setShowColorPicker(false)
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setShowImageMenu(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor.chain().focus().setImage({ src: reader.result }).run()
          setShowImageMenu(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setShowTableMenu(false)
  }

  return (
    <div style={{ borderBottom: "1px solid #ccc", padding: "5px", display: "flex", flexWrap: "wrap" }}>
      <button
        style={editor.isActive("bold") ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>
      <button
        style={editor.isActive("italic") ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </button>
      <button
        style={editor.isActive("underline") ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        U
      </button>

      <button
        style={editor.isActive("heading", { level: 1 }) ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </button>
      <button
        style={editor.isActive("heading", { level: 2 }) ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </button>
      <button
        style={editor.isActive("paragraph") ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        T
      </button>

      <button
        style={editor.isActive("bulletList") ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </button>
      <button
        style={editor.isActive("orderedList") ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </button>

      <button
        style={editor.isActive({ textAlign: "left" }) ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        ≡
      </button>
      <button
        style={editor.isActive({ textAlign: "center" }) ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        ≡
      </button>
      <button
        style={editor.isActive({ textAlign: "right" }) ? activeButtonStyle : buttonStyle}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        ≡
      </button>

      <div style={{ position: "relative", display: "inline-block" }}>
        <button style={buttonStyle} onClick={() => setShowColorPicker(!showColorPicker)}>
          Colors
        </button>
        {showColorPicker && (
          <div style={dropdownStyle}>
            <div>
              <strong>Text Colors</strong>
              <div style={{ marginBottom: "10px" }}>
                {textColors.map((color) => (
                  <span
                    key={color.color}
                    title={color.name}
                    style={{ ...colorButtonStyle, backgroundColor: color.color }}
                    onClick={() => setTextColor(color.color)}
                  ></span>
                ))}
              </div>
              <strong>Background Colors</strong>
              <div>
                {backgroundColors.map((color) => (
                  <span
                    key={color.color}
                    title={color.name}
                    style={{ ...colorButtonStyle, backgroundColor: color.color }}
                    onClick={() => setBackgroundColor(color.color)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <button style={buttonStyle} onClick={() => setShowTableMenu(!showTableMenu)}>
          Insert Table
        </button>
        {showTableMenu && (
          <div style={dropdownStyle}>
            <div>
              <label>
                Rows:
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value))}
                  style={inputStyle}
                />
              </label>
              <label>
                Columns:
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value))}
                  style={inputStyle}
                />
              </label>
              <button
                style={{ ...buttonStyle, width: "100%" }}
                onClick={insertTable}
              >
                Insert
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <button style={buttonStyle} onClick={() => setShowImageMenu(!showImageMenu)}>
          Insert Image
        </button>
        {showImageMenu && (
          <div style={dropdownStyle}>
            <div>
              <label>
                Image URL:
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={inputStyle}
                />
              </label>
              <button
                style={{ ...buttonStyle, width: "100%", marginBottom: "10px" }}
                onClick={addImage}
              >
                Insert
              </button>
              <label>
                Upload Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={inputStyle}
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {editor.isActive("table") && (
        <>
          <button
            style={buttonStyle}
            onClick={() => editor.chain().focus().addColumnBefore().run()}
          >
            Add Column Before
          </button>
          <button
            style={buttonStyle}
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            Add Column After
          </button>
          <button
            style={buttonStyle}
            onClick={() => editor.chain().focus().addRowBefore().run()}
          >
            Add Row Before
          </button>
          <button
            style={buttonStyle}
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            Add Row After
          </button>
          <button
            style={buttonStyle}
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            Delete Column
          </button>
          <button
            style={buttonStyle}
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            Delete Row
          </button>
          <button
            style={buttonStyle}
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            Delete Table
          </button>
        </>
      )}
    </div>
  )
}
