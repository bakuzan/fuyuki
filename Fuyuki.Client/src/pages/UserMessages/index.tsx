import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { capitalise } from 'ayaka/capitalise';
import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';

import authService from 'src/components/ApiAuthorisation/AuthoriseService';
import FYKLink from 'src/components/FYKLink';
import { useAsync } from 'src/hooks/useAsync';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { PageProps } from 'src/interfaces/PageProps';
import { UserMessage } from 'src/interfaces/UserMessage';
import sendRequest from 'src/utils/sendRequest';
import UserMessageItem from './UserMessageItem';

import NewTabLink from 'meiko/NewTabLink';
import './UserMessages.scss';

interface UserMessagesParams {
  mailbox: string;
}

const mailboxes = ['inbox', 'unread', 'sent'];

function UserMessages(props: PageProps<UserMessagesParams>) {
  const { params } = props.match;
  const mailbox = params.mailbox;

  const { loading, value } = useAsync<UserMessage[]>(
    async () => await sendRequest(`reddit/usermessages/${mailbox}`),
    [mailbox]
  );

  const [user, refreshUser] = useAsyncFn(
    async () => await authService.getUserObject(),
    []
  );

  useEffect(() => {
    const unsubId = authService.subscribe(() => refreshUser());
    refreshUser();

    return () => authService.unsubscribe(unsubId);
  }, [refreshUser]);

  const pageTitle = `${user.value?.name ?? 'user'} messages`;

  return (
    <div className="page">
      <Helmet title={pageTitle} />
      <section className="mailbox">
        <header className="mailbox__header">
          <h2 className="mailbox__title">{capitalise(mailbox)}</h2>
          <div className="mailbox__links">
            {mailboxes.map((box) => (
              <FYKLink
                key={box}
                className="mailbox__link"
                to={`/messages/${box}`}
              >
                {box}
              </FYKLink>
            ))}
          </div>
        </header>
        <div className="mailbox-reddit-link">
          <NewTabLink href={`https://www.reddit.com/message/${mailbox}/`}>
            View on reddit
          </NewTabLink>
        </div>
        {loading && <LoadingBouncer />}
        {!loading && value && (
          <List columns={1}>
            {value.map((x) => (
              <UserMessageItem key={x.id} data={x} />
            ))}
          </List>
        )}
      </section>
    </div>
  );
}

export default UserMessages;
