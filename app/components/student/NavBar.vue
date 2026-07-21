<template>
    <div class="navbar bg-base-100 shadow-sm px-8">
        <div class="flex-1">
            <RouterLink to="/" class="btn btn-ghost text-2xl font-bold">
                📚 Frazzetto
            </RouterLink>
        </div>

        <div class="flex-none">
            <div class="flex items-center gap-3">
                <RouterLink to="/" class="btn btn-ghost" active-class="bg-base-200">
                    Home
                </RouterLink>

                <RouterLink to="/explore" class="btn btn-ghost" active-class="bg-base-200">
                    Explore
                </RouterLink>

                <RouterLink to="/student/reviews" class="btn btn-ghost" active-class="bg-base-200">
                    My Reviews
                </RouterLink>

            </div>
        </div>
    </div>
</template>


<script setup lang="ts">

</script>