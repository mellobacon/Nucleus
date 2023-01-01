import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

const bg = "#1c1c1c",
    cl = "#282a2e",
    sel = "#373b41",
    fg = "#c5c8c6",
    com = "#969896",
    red = "#cc6666",
    orange = "#fff9f5",
    green = "#b5bd68",
    aqua = "#8abeb7",
    blue = "#81a2be",
    purple = "#b294bb";
const defaultTheme = EditorView.theme(
    {
        "*": {
            fontFamily: `"Ubuntu Mono", monospace`
        },

        "&": {
            color: fg,
            backgroundColor: bg
        },

        ".cm-content": {
            caretColor: orange
        },

        "&.cm-focused .cm-cursor": {
            borderLeftColor: orange
        },

        "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
            backgroundColor: sel
        },

        ".cm-panels": {
            backgroundColor: bg,
            color: fg
        },

        ".cm-panels.cm-panels-top": {
            borderBottom: "2px solid black"
        },

        ".cm-panels.cm-panels-bottom": {
            borderTop: "2px solid black"
        },

        ".cm-searchMatch": {
            backgroundColor: "#72a1ff59",
            outline: "1px solid #457dff"
        },

        ".cm-searchMatch.cm-searchMatch-selected": {
            backgroundColor: "#6199ff2f"
        },

        ".cm-activeLine": {
            backgroundColor: "transparent",
            boxShadow: "inset 0px 0px 0 0.5px #3f3f3f"
        },

        ".cm-selectionMatch": {
            backgroundColor: "#aafe661a"
        },

        ".cm-matchingBracket, .cm-nonmatchingBracket": {
            backgroundColor: "#bad0f847",
            outline: "1px solid #515a6b"
        },

        ".cm-gutters": {
            backgroundColor: bg,
            color: com,
            border: "none"
        },

        ".cm-activeLineGutter": {
            backgroundColor: bg,
            color: "white"
        },

        ".cm-foldPlaceholder": {
            backgroundColor: "transparent",
            border: "none",
            color: "#ddd"
        },

        ".cm-tooltip": {
            border: "1px solid #181a1f",
            backgroundColor: bg
        },
        ".cm-tooltip-autocomplete": {
            "& > ul > li[aria-selected]": {
                backgroundColor: bg,
                color: fg
            }
        }
    },
    { dark: true }
);

const defaultHighlightStyle = HighlightStyle.define([
    {
        tag: [t.typeName, t.namespace],
        class: "type"
    },
    {
        tag: t.keyword,
        class: "keyword"
    },
    {
        tag: t.function(t.variableName),
        class: "variable"
    },
    {
        tag: [t.string, t.deleted],
        class: "string"
    },
    {
        tag: [t.inserted],
        class: "literal"
    },
    {
        tag: [t.labelName],
        class: "atom"
    },

    {
        tag: [ t.character, t.propertyName, t.macroName],
        color: "#cc8c66", // orange
        class: "test"
    },

    {
        tag: [t.labelName],
        color: blue
    },

    {
        tag: [t.color, t.constant(t.name), t.standard(t.name)],
        color: orange
    },

    {
        tag: [t.definition(t.name), t.separator],
        color: fg
    },

    {
        tag: [
            t.className,
            t.number,
            t.changed,
            t.annotation,
            t.modifier,
            t.self,
        ],
        color: purple
    },

    {
        tag: [
            t.operator,
            t.operatorKeyword,
            t.url,
            t.escape,
            t.regexp,
            t.link,
            t.special(t.string)
        ],
        color: aqua
    },

    {
        tag: [t.meta, t.comment],
        color: com
    },

    {
        tag: t.strong,
        fontWeight: "bold"
    },

    {
        tag: t.emphasis,
        fontStyle: "italic"
    },

    {
        tag: t.strikethrough,
        textDecoration: "line-through"
    },

    {
        tag: t.link,
        color: com,
        textDecoration: "underline"
    },

    {
        tag: t.heading,
        fontWeight: "bold",
        color: red
    },

    {
        tag: [t.atom, t.bool, t.special(t.variableName)],
        color: orange
    },

    {
        tag: [t.processingInstruction],
        color: "#df8cc9" // pink
    },

    {
        tag: t.invalid,
        color: "#ffffff"
    }
]);

const test = HighlightStyle.define([
        { tag: t.meta, class: "meta" },
        { tag: t.link, class: "link" },
        { tag: t.heading, class: "heading" },
        { tag: t.emphasis, class: "emphasis" },
        { tag: t.strong, class: "strong" },
        { tag: t.strikethrough, class: "strikethrough" },
        { tag: t.keyword, class: "keyword" },
        {
          tag: [
            t.atom,
            t.bool,
            t.url,
            t.contentSeparator,
            t.labelName,
          ],
          class: "atom",
        },
        { tag: [t.literal, t.inserted], class: "literal" },
        { tag: [t.string, t.deleted], class: "string" },
        {
          tag: [
            t.regexp,
            t.escape,
            t.special(t.string),
          ],
          class: "regex",
        },
        {
          tag: t.definition(t.variableName),
          class: "variable",
        },
        { tag: [t.typeName], class: "type" },
        { tag: t.className, class: "class" },
        {
          tag: [t.special(t.variableName), t.macroName, t.character],
          class: "macro",
        },
        {
          tag: t.definition(t.propertyName),
          class: "property",
        },
        { tag: t.comment, class: "comment" },
        { tag: t.invalid, class: "invalid" },
        { tag: t.bracket, class: "bracket" },
        { tag: t.function(t.name), class: "functionCall" },
        { tag: t.namespace, class: "namespace" },
        {
            tag: [t.processingInstruction],
            color: "#df8cc9" // pink
        },
        {
            tag: t.propertyName,
            class: "propertyName"
        }
      ])


export const default_theme: Extension = [defaultTheme, syntaxHighlighting(test)];