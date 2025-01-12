<template>
	<div class="tiptap-editor">
		<div
			v-if="editor"
			class="tiptap-editor__menu"
		>
			<UButton
				class="px-2.5"
				:class="{ 'is-active': editor.isActive('paragraph') }"
				label="P"
				square
				variant="soft"
				color="yellow"
				@click="editor.chain().focus().setParagraph().run()"
			/>
			<UButton
				:class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
				label="H1"
				square
				variant="soft"
				color="yellow"
				@click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
			/>
			<UButton
				:class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
				label="H2"
				square
				variant="soft"
				color="yellow"
				@click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
			/>
			<UButton
				:class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
				label="H3"
				square
				variant="soft"
				color="yellow"
				@click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
			/>

			<UButton
				:disabled="!editor.can().chain().focus().toggleBold().run()"
				:class="{ 'is-active': editor.isActive('bold') }"
				square
				color="yellow"
				variant="soft"
				icon="i-heroicons-bold"
				@click="editor.chain().focus().toggleBold().run()"
			/>
			<UButton
				:disabled="!editor.can().chain().focus().toggleItalic().run()"
				:class="{ 'is-active': editor.isActive('italic') }"
				square
				color="yellow"
				variant="soft"
				icon="i-heroicons-italic"
				@click="editor.chain().focus().toggleItalic().run()"
			/>
			<UButton
				:disabled="!editor.can().chain().focus().toggleItalic().run()"
				:class="{ 'is-active': editor.isActive('underline') }"
				square
				color="yellow"
				variant="soft"
				icon="i-heroicons-underline"
				@click="editor.chain().focus().toggleUnderline().run()"
			/>
			<UButton
				:class="{ 'is-active': editor.isActive('bulletList') }"
				icon="i-heroicons-list-bullet"
				square
				color="yellow"
				variant="soft"
				@click="editor.chain().focus().toggleBulletList().run()"
			/>
			<UButton
				:class="{ 'is-active': editor.isActive('horizontalRule') }"
				label="HR"
				square
				color="yellow"
				variant="soft"
				@click="editor.chain().focus().setHorizontalRule().run()"
			/>
			<span class="tiptap-editor__md">(Markdown)</span>
		</div>
		<EditorContent
			class="tiptap-editor__editor"
			:editor="editor"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Editor as TiptapEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

interface Props {
	modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
const editor = ref<TiptapEditor>();

onMounted(() => {
	editor.value = new TiptapEditor({
		content: props.modelValue ?? '',
		extensions: [StarterKit, Underline, HorizontalRule],
		onUpdate: ({ editor }) => {
			emit('update:modelValue', editor.getHTML());
		},
	});
});

onBeforeUnmount(() => {
	editor.value?.destroy();
});
</script>

<style lang="scss">
.tiptap-editor {
  &__menu {
    @apply flex flex-wrap gap-2 mb-3;
  }

  &__md {
    @apply text-sm text-gray-500 self-end;
  }

  &__editor {
    @apply border border-gray-300 rounded min-h-56;

    & div[contenteditable] {
      @apply w-full min-h-56 p-4;
    }
  }
}

.tiptap {
  h1 {
    @apply text-3xl font-bold;
  }

  h2 {
    @apply text-2xl font-bold;
  }

  h3 {
    @apply text-xl font-semibold;
  }

  p {
    @apply text-base;
  }

  ul {
    @apply list-disc pl-6;
  }

  hr {
    @apply border-t border-gray-300 my-4;
  }
}
</style>
