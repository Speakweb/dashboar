import {findOs} from "./findOs";
export function promptSetBitbucketCredentials() {
    if (!process.env["BITBUCKET_EMAIL"] || !process.env["BITBUCKET_PASSWORD"]) {

        if (findOs() === "win32") {
            prompt('Please set your bitbucket email and password environment variables')
        }

        if  (findOs() === "MacOrLnx") {
            prompt("Please append (export BITBUCKET_EMAIL=foo@bar.com; " +
                "export BITBUCKET_PASSWORD=foobar) to your ~/.bashrc or ~/.zshrc)")
        }
    }
}
