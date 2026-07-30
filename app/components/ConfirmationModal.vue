<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4">
                {{ title }}
            </h2>

            <p class="text-gray-600 mb-8">
                {{ message }}
            </p>

            <div class="flex justify-end gap-4">
                <button class="btn bg-white border border-gray-300 text-gray-800 px-6" @click="cancel">
                    Cancel
                </button>

                <button class="btn bg-red-600 text-white px-6 hover:bg-red-700" @click="confirm">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        show: boolean;
        title?: string;
        message?: string;
    }>(),
    {
        title: "Confirm Action",
        message: "Are you sure you want to continue?",
    },
);

const emit = defineEmits<{
    confirm: [];
    cancel: [];
}>();

function confirm() {
    emit("confirm");
}

function cancel() {
    emit("cancel");
}
</script>