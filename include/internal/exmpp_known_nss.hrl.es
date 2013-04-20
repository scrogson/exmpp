#!/usr/bin/env escript
%% -*- erlang -*-

main([ Known_NSS_Src ]) ->
    io:format("% exmpp_known_nss.hrl.es~n"),
    Namespaces = lists:usort(read_nss(Known_NSS_Src)),
    io:format("-define(XMPP_KNOWN_NSS,~n"
              "        ~p).~n~n",
              [ [ binary_to_list(NS)
                  || NS <- Namespaces ] ]),
    timer:sleep(10).

read_nss(Known_NSS_Src) ->
    {ok, File} = file:open(Known_NSS_Src, [read, binary]),
    read_nss(File, io:get_line(File, ""), []).

read_nss(File, eof, Acc) ->
    file:close(File),
    lists:reverse(Acc);
read_nss(File, << $#, _/binary >>, Acc) ->
    read_nss(File, io:get_line(File, ""), Acc);
read_nss(File, << $\n >>, Acc) ->
    read_nss(File, io:get_line(File, ""), Acc);
read_nss(File, NS_bin, Acc) when is_binary(NS_bin) ->
    Len = byte_size(NS_bin) - 1,
    << NS:Len/binary, _/binary >> = NS_bin,
    read_nss(File, io:get_line(File, ""),
             [NS | Acc]).
