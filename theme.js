import {createTheme} from 'thememirror';
import {tags as t} from '@lezer/highlight';

const myTheme = createTheme({
	variant: 'dark',
	settings: {
		background: '#434257',
		foreground: '#8ba4c6',
		caret: '#bba7dd',
		selection: '#d33131',
		lineHighlight: '#87787c',
		gutterBackground: '#9c9dab',
		gutterForeground: '#0a0b19',
	},
	styles: [
		{
			tag: t.comment,
			color: '#8b9b69',
		},
		{
			tag: t.variableName,
			color: '#c9a236',
		},
		{
			tag: [t.string, t.special(t.brace)],
			color: '#c0076a',
		},
		{
			tag: t.number,
			color: '#ad58d5',
		},
		{
			tag: t.bool,
			color: '#5c6166',
		},
		{
			tag: t.null,
			color: '#5c6166',
		},
		{
			tag: t.keyword,
			color: '#5c6166',
		},
		{
			tag: t.operator,
			color: '#5c6166',
		},
		{
			tag: t.className,
			color: '#5c6166',
		},
		{
			tag: t.definition(t.typeName),
			color: '#5c6166',
		},
		{
			tag: t.typeName,
			color: '#5c6166',
		},
		{
			tag: t.angleBracket,
			color: '#5c6166',
		},
		{
			tag: t.tagName,
			color: '#5c6166',
		},
		{
			tag: t.attributeName,
			color: '#5c6166',
		},
	],
});