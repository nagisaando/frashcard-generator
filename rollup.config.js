import preprocess from 'svelte-preprocess';


/* ... */


// and add preprocess as a plugin:
export default {
    /* ... */
    plugins: [
        svelte({
            /* ... */
            preprocess: preprocess()
        })
    ],
    /* ... */
}