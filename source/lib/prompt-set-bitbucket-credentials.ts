export function promptSetBitbucketCredentials() {
    if (!process.env["BITBUCKET_EMAIL"] || !process.env["BITBUCKET_PASSWORD"]) {
        const isWin = process.platform === "win32";
        const isMac = process.platform === "darwin";
        const isLnx = process.platform === "linux"

        if (isWin) {
            prompt('Please set your bitbucket email and password environment variables')
        }

        if  (isMac || isLnx) {
            prompt("Please append (export BITBUCKET_EMAIL=foo@bar.com; " +
                "export BITBUCKET_PASSWORD=foobar) to your ~/.bashrc or ~/.zshrc)")
        }
    }
}
