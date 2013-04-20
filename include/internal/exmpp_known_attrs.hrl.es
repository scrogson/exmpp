#!/usr/bin/env escript
%% -*- erlang -*-

main([ Known_ATTRS_Src ]) ->
    io:format("% exmpp_known_attrs.hrl.es~n"),
    Attributes = lists:usort(read_attrs(Known_ATTRS_Src)),
    io:format("-define(XMPP_KNOWN_ATTRS,~n"
              "        ~p).~n~n",
              [ [ binary_to_list(ATTR)
                  || ATTR <- Attributes ] ]),
    timer:sleep(10).

read_attrs(Known_ATTRS_Src) ->
    {ok, File} = file:open(Known_ATTRS_Src, [read, binary]),
    read_attrs(File, io:get_line(File, ""), []).

read_attrs(File, eof, Acc) ->
    file:close(File),
    lists:reverse(Acc);
read_attrs(File, << $#, _/binary >>, Acc) ->
    read_attrs(File, io:get_line(File, ""), Acc);
read_attrs(File, << $\n >>, Acc) ->
    read_attrs(File, io:get_line(File, ""), Acc);
read_attrs(File, ATTR_bin, Acc) when is_binary(ATTR_bin) ->
    Len = byte_size(ATTR_bin) - 1,
    << ATTR:Len/binary, _/binary >> = ATTR_bin,
    read_attrs(File, io:get_line(File, ""),
	       [ATTR | Acc]).
