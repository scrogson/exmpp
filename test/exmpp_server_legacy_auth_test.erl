-module(exmpp_server_legacy_auth_test).

-include_lib("eunit/include/eunit.hrl").

-include("exmpp.hrl").


fields_test() ->
	S = <<"<iq type='get' to='shakespeare.lit' id='auth1'>
		  <query xmlns='jabber:iq:auth'/>
		</iq>">>,
	{ok, [Req]} = exxml:parse_document(S),
	?assertMatch([{xmlel, <<"username">>, _, _}, {xmlel, <<"password">>, _, _}, {xmlel, <<"resource">>, _, _}],
		exxml:get_els(exxml:get_el(exmpp_server_legacy_auth:fields(Req, plain),<<"query">>))),
	?assertMatch([{xmlel, <<"username">>, _, _}, {xmlel, <<"digest">>, _, _}, {xmlel, <<"resource">>, _, _}],
		exxml:get_els(exxml:get_el(exmpp_server_legacy_auth:fields(Req, digest),<<"query">>))),
	?assertMatch([{xmlel, <<"username">>, _, _}, {xmlel, <<"password">>, _, _},{xmlel, <<"digest">>, _, _}, {xmlel, <<"resource">>, _, _}],
		exxml:get_els(exxml:get_el(exmpp_server_legacy_auth:fields(Req, both),<<"query">>))),
	ok.
   
success_test() ->
	S = <<"<iq type='set' id='auth2'> <query xmlns='jabber:iq:auth'>
    	<username>bill</username> <password>Calli0pe</password>
    	<resource>globe</resource> </query> </iq>">>,
    	{ok, [Req]} = exxml:parse_document(S),
	Sucess = exmpp_server_legacy_auth:success(Req),
	?assertMatch({xmlel, <<"iq">>, _, []}, Sucess),
	?assertEqual(<<"result">>, exxml:get_attr(Sucess, <<"type">>)),
	?assertEqual(<<"auth2">>, exxml:get_attr(Sucess, <<"id">>)),
	ok.

failure_test() ->
	S = <<"<iq type='set' id='auth2'> <query xmlns='jabber:iq:auth'>
    	<username>bill</username> <password>Calli0pe</password>
    	<resource>globe</resource> </query> </iq>">>,
    	{ok, [Req]} = exxml:parse_document(S),
	F = exmpp_server_legacy_auth:failure(Req, <<"not-authorized">>),
	?assertMatch({xmlel, <<"iq">>, _, _}, F),
	?assertEqual(<<"401">>, 
		exxml:get_path(F,[{element, <<"error">>}, {attribute, <<"code">>}])),
	?assertEqual(<<"auth">>, 
		exxml:get_path(F,[{element, <<"error">>}, {attribute, <<"type">>}])),
	?assertEqual(<<"urn:ietf:params:xml:ns:xmpp-stanzas">>, 
		exxml:get_path(F,[{element, <<"error">>}, {element, <<"not-authorized">>}, {attribute, <<"xmlns">>}])),
	ok.

want_fields_test() ->
	S = <<"<iq type='get' to='shakespeare.lit' id='auth1'>
		  <query xmlns='jabber:iq:auth'/>
		</iq>">>,
	{ok, [Req]} = exxml:parse_document(S),
	?assert(exmpp_server_legacy_auth:want_fields(Req)),
	ok.

get_credentials_test() ->
	S = <<"<iq type='set' id='auth2'> <query xmlns='jabber:iq:auth'>
    	<username>bill</username> <password>Calli0pe</password>
    	<resource>globe</resource> </query> </iq>">>,
    	{ok, [Req]} = exxml:parse_document(S),
	?assertMatch({<<"bill">>, {plain, <<"Calli0pe">>}, <<"globe">>}, exmpp_server_legacy_auth:get_credentials(Req)),
	S2 = <<"<iq type='set' id='auth2'>
		  <query xmlns='jabber:iq:auth'>
			    <username>bill</username>
			    <digest>48fc78be9ec8f86d8ce1c39c320c97c21d62334d</digest>
			    <resource>globe</resource>
		  </query>
		</iq>">>,
    	{ok, [Req2]} = exxml:parse_document(S2),
	?assertMatch({<<"bill">>, {digest,_}, <<"globe">>}, exmpp_server_legacy_auth:get_credentials(Req2)),
	%%TODO: check digest result
	ok.
