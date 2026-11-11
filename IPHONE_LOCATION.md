# Update the portfolio city from iPhone

The portfolio reads `location.json` from the `location-data` branch of
`bradenweii/bradenweii.github.io`. Deploy the portfolio feature once. Updates
to the data branch do not require a site rebuild. A blank remote city falls
back to the manual city in `public/location.json`.

## GitHub credential

Create a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new).
Set the resource owner to `bradenweii`, select only `bradenweii.github.io`,
and grant **Contents: Read and write**. Set an expiration. Keep the token on
your phone and do not share the shortcut with the token embedded. The token
can modify other files in this repository, so revoke it if it is exposed.

## Build the shortcut

In Shortcuts, create **Update Portfolio City**.

1. Add **Get Current Location**, then use **Get Details of Locations** to get
   its **City** and **Country**. Stop if City is empty. Use a Text action to
   join them as `City, Country`, and name that result `New city`.
2. Add **Get Contents of URL** with the GET method and this URL:
   `https://api.github.com/repos/bradenweii/bradenweii.github.io/contents/location.json?ref=location-data`.
   Set the Accept header to `application/vnd.github+json`. Save the response's
   `sha` as `File SHA`. Stop if it is empty.
3. Read the response's `content`, Base64-decode it, and get the `city` value
   from the decoded JSON dictionary. Stop if it matches `New city`.
4. Make a Dictionary with one entry, `city` set to `New city`. Convert the
   dictionary to text and Base64-encode it with line breaks off.
5. Add another **Get Contents of URL** with the PUT method and this URL:
   `https://api.github.com/repos/bradenweii/bradenweii.github.io/contents/location.json`.
   Add the headers `Authorization: Bearer YOUR_TOKEN` and
   `Accept: application/vnd.github+json`. Choose **JSON** for the request body
   and use these fields:

   | Key | Value |
   | --- | --- |
   | `message` | `Update portfolio city` |
   | `branch` | `location-data` |
   | `sha` | `File SHA` from the GET request |
   | `content` | The Base64-encoded dictionary |

Run the shortcut manually once to grant location access and check the branch.
Then open **Shortcuts > Automation**, create a **Time of Day** automation,
set it to repeat daily, select **Run Immediately**, and run the shortcut.
You can also run it manually when you arrive in a new city.

Only the city and country are sent. The branch is public and its commit
history retains previously published cities. To pause updates, disable the
automation on your iPhone. To hide the label, clear the city in both location
files. GitHub's cache can delay visible changes briefly.
