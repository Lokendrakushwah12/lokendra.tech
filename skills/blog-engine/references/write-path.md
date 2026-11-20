# The write path

The agent suggests. This is the code that acts. It is the only part of the
engine that can change the site, so it is the part that gets tests.

## Shape

```
agent run          ->  suggestion stored (id, slug, field, before, after, source)
                   ->  card posted with buttons carrying only the suggestion id
person clicks      ->  handler loads the suggestion by id
                   ->  re-validates, locks, writes, enrols, records
                   ->  card is replaced by a link to the live change
```

Two properties matter:

- **The button carries an id, not the edit.** The handler loads the stored
  suggestion. Trusting an edit that travelled through a chat payload lets
  anyone who can forge a click write to the site.
- **The handler runs outside the agent's session.** The run that drafted the
  suggestion ended long ago. Approval can happen days later, by someone else.

## Re-validate everything

The agent's claims are inputs, not facts. Before writing, the handler checks:

- the post still exists and is published;
- the `before` text is still there, exactly, exactly once. If the post changed
  since the suggestion, refuse and say so; do not apply a swap to text that
  moved;
- the `after` text is within the limits for that field (title and description
  lengths, a link that resolves);
- the edit is one of the allowed kinds;
- the post is not in a cooldown from an earlier edit. Refuse, do not warn: the
  suggestion may predate the edit that started the cooldown. The one exception
  is a dead-link fix, which does not change what is being measured.

A refused write updates the card with the reason. A silent failure looks like an
approved edit that never appeared.

## Allowed edits

| Kind | Changes |
|---|---|
| SEO title | the title field |
| SEO description | the description field |
| Swap | one exact phrase or link in the body, replaced by another |

Anything that cannot be expressed as one of these is posted with **Edit** and
**Skip** only. Edit opens a field for a person to write the change; the handler
then treats that text as the `after` and validates it the same way.

## The lock

The suggestion locks the moment someone clicks. Without it, two people approving
within a second both publish, and the second write either duplicates the first
or fails halfway. Implement it as a conditional update on the suggestion's
status (`suggested` -> `applying` only if it is still `suggested`) and act only
if the update changed a row.

## Stale drafts in a CMS

Most CMSs keep an unsaved draft alongside the published document. If someone has
a draft open that predates the edit, publishing the edit and then having them
save their draft silently undoes it.

Before writing, check for an existing draft of the document. If there is one,
refuse and name who owns it if the CMS says. This is the failure that takes
longest to notice, because everything reports success.

## Auto-apply

Two classes of edit are safe enough to skip approval, because they are
mechanical and there is no judgement in them:

- **A dead link with a known replacement.** The old URL returns an error, and a
  redirect map or the docs give the new one.
- **Filling an empty SEO field.** Anything is better than blank, and the field
  is easy to revise.

Keep the list this short. Both still go through the same handler and the same
validation, are recorded as `auto_applied`, and are listed in the weekly report
so they are visible after the fact. "Fix a typo" is not on the list: a spelling
"correction" to a product name or a code identifier is a real regression.

## Order of operations on approve

1. Write the change.
2. Enrol the post for measurement: store the baseline window's dates now, take
   the snapshot (or mark it pending for a job to fill from those dates), set
   the cooldown, schedule the two readings.
3. Record the decision (who, when).

Each step is wrapped so its failure does not stop the earlier ones from
standing: a failed recording must not block enrolment, and a failed enrolment
must not roll back a publish the person asked for. Log the partial failure and
surface it in the next report.

## Adapters

### A CMS with an API

The handler is a small server route holding the CMS write token. The agent's
environment never has that token. Publish through the CMS's mutation API inside
one transaction where it offers one.

### Posts in git

There is no server to write. The equivalent design:

- a suggestion is a pull request that changes one line (or adds one file, for a
  generated post);
- approving is merging;
- re-validation is a CI check on the pull request: the diff touches only
  allowed fields, the gates pass on a generated post, the branch is up to date;
- the lock and the stale-draft problem are handled by git itself, since a
  conflicting change makes the pull request unmergeable;
- enrolment runs in a workflow triggered by the merge.

The agent still gets no write access to the default branch. It opens pull
requests from a branch; branch protection does the rest.

Keep each pull request to one suggestion. A batch of twelve title changes in one
pull request gets merged without being read, which defeats the review this
design exists for.

### No chat tool

A weekly email or a GitHub issue listing the suggestions, each linking to its
pull request or to an approve URL, is a complete surface. The requirement is
that it arrives somewhere the person already looks, not that it is Slack.
