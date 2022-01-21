import { useEffect, useRef } from 'react';
import type { ActionFunction } from 'remix';
import { Form, json, useActionData, redirect } from 'remix';
import invariant from 'tiny-invariant';
import Button from '~/components/elements/buttons/Button';
import InputArea from '~/components/form/inputtext/InputArea';
import BasicForm from '~/components/form/layout/FormBasic';

export function meta() {
  return { title: 'Mint Tokens' };
}
type ActionMessage = {
  pubKey: string;
  privKey: string;
};
// When your form sends a POST, the action is called on the server.
// - https://remix.run/api/conventions#action
// - https://remix.run/guides/data-updates
export let action: ActionFunction = async ({ request }) => {
  let body = await request.formData();
  let name = body.get('name');
  let description = body.get('description');
  let publisher = body.get('publisher');
  let url = body.get('url');

  return null;
};

export default function ActionsDemo() {
  // https://remix.run/api/remix#useactiondata
  let err = useActionData();

  return (
    <>
      <BasicForm />
    </>
  );
}
