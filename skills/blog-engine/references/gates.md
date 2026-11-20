# Generating posts, and the gates in front of them

## Picking a topic

### Near-misses

The best topics are queries the site already appears for and has no real answer
to. From query-level search data, keep rows where:

- impressions in the window are meaningful (150+ is a workable floor),
- position is between 5 and 20, and
- no existing post is dedicated to the query.

"Dedicated" needs a definition the code can check. A practical one: no post has
the query's main terms in its title, slug or first heading, and no single post
takes most of that query's clicks. When one post does take most of the clicks,
the query is owned; send it to the audit as a `rank` or `ctr` fix instead.

Group near-misses that mean the same thing before choosing, or the engine writes
three posts for one intent. Simple term overlap after removing stop words is
enough at this scale.

Rank the groups by summed impressions, then filter by strategy. High impressions
on a topic outside what the site is for is not a topic.

### Requested topics

Someone asking for a post is input, not approval. Run the same classification,
strategy check and cannibalization check. When it fails, stop and ask a
follow-up question that names the conflict ("we already rank for this with
`/blog/x`; do you want that post improved instead?"). Do not write something
adjacent and present it as what was asked for.

## The draft

- **Code comes from the source of truth, copied, with its URL.** Not recalled,
  not adapted from memory. A blog post with a snippet that does not run costs
  more trust than the post earns.
- **Open with a labelled summary.** Readers skim, and answer engines quote the
  part that answers the question directly. A short summary at the top serves
  both.
- **One query group per post.** A post chasing three intents ranks for none.

Then the agent reviews its own draft against the writing checklist. Quality is
decided here, before the gate.

## The four gates

Run them in code, on a structured draft, before anything is saved anywhere. Each
returns a list of failures; an empty list passes. Keep a separate list of
advisories that are reported and do not block.

### 1. Strategy

- No banned terms: competitor names used as claims, superlatives the company
  will not stand behind, deprecated product names.
- The post declares a content cluster and a reader, and both exist in the
  strategy file. A post that fits no cluster is a sign the topic was wrong.

### 2. Structure

- Opens with the labelled summary.
- Has a title and description within the length the search result shows.
- Has the fields the CMS requires. An unlisted draft with missing fields becomes
  a broken page on approve.

Keep this list short. It checks that the post is well-formed, not that it is
good.

### 3. Code provenance

Every code block carries the URL it was copied from, and the URL is http(s).
That is the blocking check. A missing version pin is an advisory.

A stricter and worthwhile extension: fetch each URL and confirm the snippet
appears on the page after normalising whitespace. It catches a real URL attached
to invented code, which the format check cannot.

**Where the snippets call an SDK or CLI, compile them too.** Type-check or parse
each snippet against the installed version (`tsc --noEmit`, `pyright`, a dry-run
of the CLI) and fail closed: if the checker cannot run, the draft does not pass.
The two checks catch different failures, so neither replaces the other:

- the source URL shows where a snippet came from, and misses docs that have gone
  stale since;
- the compile check shows the API exists today, and passes code that no page of
  the docs ever recommended.

A post that got published with a method the SDK does not have is caught by the
compile check, not the URL. If only one can be built this week, build that one
for API-heavy posts and the URL check for everything else.

### 4. Cannibalization

For each target query, look up which of the site's own pages already receive
its impressions. If an existing post owns the query, fail.

This failure is different from the other three: **it is not retryable**. The
agent must not rephrase and resubmit, because a reworded post on the same query
is exactly the harm the check exists to prevent. Two posts on one query split
the ranking and usually leave both lower than one was. The correct output is the
owning post's slug and a hand-off to the audit.

## Redrafts

Two attempts after a failure, then stop with no draft and report which gate
failed. An unbounded retry loop turns the gate into a search for whatever
slips through.

## After the gates

Save as an unlisted draft (or, for posts in git, open a pull request with the
file). Store the gate report with the draft, so the reviewer sees what was
checked and what was only advised.

The card says what was written and **why this query**: the impressions, the
position, and the fact that nothing on the site answered it. A reviewer who can
see the reason approves or discards in seconds; one who cannot has to
reconstruct it.

## Do not gate taste

The pull to add rules ("no sentences over 30 words", "must include an example")
never ends, and each rule is a line of code that someone has to maintain and
that eventually blocks a good post. Facts, structure and provenance are
checkable; whether the writing is good is judgement, and judgement belongs in
the checklist the agent applies before the gate, where changing it is a
one-line edit.
