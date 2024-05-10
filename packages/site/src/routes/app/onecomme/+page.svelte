<script lang="ts">
    import { Header } from '@omuchatjs/ui';
    import { BROWSER } from 'esm-env';
    import { client } from './client.js';

    if (BROWSER) {
        client.start();
    }
</script>

<Header title="わんコメテンプレート同期" icon="ti-dog"></Header>
