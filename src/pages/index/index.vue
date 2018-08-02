<template>
    <div>Hello, {{msg}}</div>
</template>

<script>
export default {
    data() {
        return {
            msg: 'world'
        };
    }
};
</script>

<style>
div {
    font-size: 20px;
}
</style>