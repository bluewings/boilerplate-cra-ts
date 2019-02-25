/* eslint-disable import/no-extraneous-dependencies, no-restricted-globals,  */
import React from 'react';
import { Docs, ThemeConfig } from 'docz';
import Octicon, { Markdown } from '@githubprimer/octicons-react';
import './EditPage.scss';

function compare(a, b) {
  if (a.route.length === b.route.length) {
    return 0;
  }
  return a.route.length < b.route.length ? -1 : 1;
}

function EditPage() {
  return (
    <ThemeConfig>
      {({ repository }) => {
        if (!repository) {
          return null;
        }
        const masterTree = repository.replace(/[/]{0,1}$/, '/tree/master/');
        return (
          <div className="wrapper_edit_page">
            <Docs>
              {({ docs }) => {
                const hash = location.hash.replace(/^#/, '');
                const found = [...docs].sort(compare).find((e) => e.route.search(hash) === 0);
                if (found) {
                  return (
                    <a href={masterTree + found.filepath} rel="noopener noreferrer" target="_blank">
                      <Octicon icon={Markdown} size="medium" />
                    </a>
                  );
                }
                return null;
              }}
            </Docs>
          </div>
        );
      }}
    </ThemeConfig>
  );
}

export default EditPage;
