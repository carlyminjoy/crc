<template>
    <li>
        <div class='icons'>
            <i class='fa caret' :class="{ 'fa-caret-up' : section.improvement, 'fa-caret-down' : section.decline }"></i>
            <i class='fa' :class="{ 'fa-check' : good, 'fa-exclamation-circle' : !good }"></i>
        </div>
        <p> {{ section.answer }} <br>
            <strong>
                <span v-if='section.bmi'><br>Your BMI is: {{ section.bmi }}.<br><br></span>
                <span v-if='!good' v-html='section.recommendation'>
            </strong>
        </p>
    </li>
</template>

<script>

export default {
    name: 'feedback',
    props: ['section', 'good']
}

</script>

<style lang='scss' scoped>

.grey {
    i.caret {
        color: rgb(44, 62, 80);
    }
}

div.icons {
    display:flex;
    justify-content:space-between;

    i.caret {
        width: 20px;
        margin-right: 15px!important;
        border-radius: 50%;
        text-align:center;
        height: 20px;
        line-height: 20px;
        font-size: 24px!important;
        
        // font-size: 16px!important;

        // &.fa-caret-up {
        //     color: #5ebc5e;
        //     background: rgb(44, 62, 80);
        // }

        // &.fa-caret-down {
        //     color: #FCD208;
        //     background: rgb(44, 62, 80);
        // }
    }
}
</style>