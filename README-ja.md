
![mirabow-image](doc/images/wide-icon.png)

# MIRABOW SQL

**MIRABOW SQL** は [MIRABOW](https://github.com/TBSten/mirabow) をベースに作られたSQLパーサーです。
標準SQLやSQLiteのSQLを解析し、必要な部分を抽出することができます。
ブラウザ,Node,TypeScriptに対応しており、依存関係はMIRABOWのみです。

## インストール

```shell

# npm でインストール
npm install --save mirabow mirabow-sql
# yarn でインストール
yarn add mirabow mirabow-sql

```

## 使い方

### 概要

```typescript
import { execute } from 'mirabow'
import { statementsMatcher } from 'mirabow-sql'

const data = 'select * from tbl1 ;'

const result = execute( statementsMatcher(), data )
/*
result = {
    isOk: true, //if the analysis is successful, `true` otherwise, `false`
    capture:{
        // captured data
    },
    tokens:[
        // all tokens
    ],
    match:[
        // matched tokens
    ],
}
*/

```

### 1. 各APIをインポートする

まずは`mirabow`から`execute`関数をインポートしてください。
次に**マッチャー**をインポートします。マッチャーとは文字列(トークン)がどのように並ぶかを定義した「文字列パターン」のことです。
MIRABOW SQL では入力文字列をマッチャーに対応づけし、入力文字列から情報を抽出します
基本的には`mirabow-sql`からインポートしますが、オリジナルのマッチャーを用意することもできます。
ここでは`statementsMatcher`をインポートしておきます。

```typescript
import { execute } from 'mirabow'
import { statementsMatcher } from 'mirabow-sql'

```

入力文字列として

- 複数のSQL文を受け取りたいときは`statementsMatcher`を
- 一つのSQL文を受け取りたいときは`statementMatcher`(sがない)を
- SELECT文を受け取りたいときは`selectMatcher`を
- ... (UPDATE,DELETEなど以下同様です)

それぞれ使用します。

どのSQL文に対応しているか知りたい場合は [レファレンス](#レファレンス) を参照してください

### 2. マッチャーを実行する

`execute`関数にマッチャーと入力文字列を渡して実行してください
(以下の例ではstatementsMatcherとINSERT,SELECT文を渡しています)。

```typescript

const data = 'select * from tbl1 ;'

const result = execute( statementsMatcher(), data )

```

### 3. 情報を抽出する

`execute`関数の戻り値には以下のような情報が含まれています。

- `isOk` は入力文字列(data)がマッチャーに完全にマッチしたかを表す
- `capture` はキャプチャされた文字列トークン
- `tokens` は全てのトークン
- `match` はマッチした全てのトークン

```typescript

const result = execute( statementsMatcher(), data )
/*
result = {
    isOk: true, //if the analysis is successful, `true` otherwise, `false`
    tokens:[
        // all tokens
    ],
    match:[
        // matched tokens
    ],
    capture:{
        // captured data
    },
}
*/

```

例えば上記コード上を実行すると得られるresultの内容は以下の通りです。

```typescript
// execute(statementsMatcher(), '')
{
    isOk: true,                             // マッチャーの実行成功を表す
    capture: {
        'sql-statement-scope' :[            // 各SQLごとのキャプチャスコープ
            {
                'select-select':[['*']],    // SELECT文のSELECT句で指定されたものを表す
                'select-from':[['tbl1']],   // SELECT文のFROM句で指定されたものを表す
            },
        ],
    },
}

```

よってSELECT文のFROM句で指定された値('tbl1')を取得するためには
`result.capture["sql-statement-scope"][0]["select-from"]`
と指定します。

上記のように配列やオブジェクトが何重にも複雑に格納されるのには実装上の理由がありますが、現時点でそれを理解する必要はありません。
それについて学習するためには [MIRABOWのドキュメント](https://github.com/TBSten/mirabow) をご覧ください。

また、各キャプチャ名(`"sql-statement-scope"`や`"select-from"`)は直接文字列で指定しても構いませんが、
IDEの補完機能を活用するために各文毎に定義されている`xxxKey`オブジェクトを使って指定することをお勧めします。

`Key`オブジェクトを活用して

`result.capture["sql-statement-scope"][0]["select-from"]`

と同等の結果を得るには

`result.capture[statementsKey.scope][0][selectKey.from]`

と指定します。

またどのようなマッチャーがどのようにキャプチャするのか、どのような`Key`オブジェクトが用意されているのかについては
[レファレンス](#レファレンス) を参照してください。

---

## reference

各マッチャーの名前やそれらがどのような値をキャプチャするかを詳細に説明します。

### statements

#### `statements`

matcher     : `statementsMatcher`
key         : `statementsKey`

`statementsMatcher`は';'で区切られた複数のSQL文を解析するための非常に基本的なマッチャーです。
このライブラリを使用するにあたって一番多く使用するマッチャーでしょう。

##### `statementsMatcher` capture

`statementsMatcher`を使用すると以下のようにキャプチャします。

```typescript
output.capture = {
    [statementsKey.scope]:[
        //1つ目のSQLのキャプチャ
        {
            [statementsKey.statement] : [/* マッチしたSQLのトークン列 */],
            [statementsKey.xxx] : [/* マッチしたSQL(xxx文)のトークン列(sql-statement) */],
            //該当SQLのマッチャーでキャプチャしたトークン列...
        },
        //2つ目のSQLのキャプチャ
        ...
    ]
}
```

以下が実行例です

```typescript
const result = execute(statementsMatcher(),'select * from tbl1 ; select * from tbl2')
result.capture = {
    'sql-statement-scope': [
        //1つ目のSELECT文のキャプチャ結果
        {
            'sql-statement-select': [ [ 'select', '*', 'from', 'tbl1' ] ],
            'sql-statement': [ [ 'select', '*', 'from', 'tbl1' ] ],
            //以下SELECT文のキャプチャ結果
            column: [ [ '*' ] ],
            'select-select': [ [ '*' ] ],
            'select-from': [ [ 'tbl1' ] ],
        },
        //2つ目のSELECT文のキャプチャ結果
        {
            'sql-statement-select': [ [ 'select', '*', 'from', 'tbl2' ] ],
            'sql-statement': [ [ 'select', '*', 'from', 'tbl2' ] ],
            //以下SELECT文のキャプチャ結果
            column: [ [ '*' ] ],
            'select-select': [ [ '*' ] ],
            'select-from': [ [ 'tbl2' ] ],
        }
    ]
}
```

- `sql-statement`と`sql-statement-xxx`は基本的には同じトークン列がキャプチャされます。
ライブラリのユーザはもしマッチしたSQL文がxxx文なら〜といった処理が必要な場合に`sql-statement-xxx`を各文に使用してxxx文がマッチしたかどうかを判別できます。

```typescript
const result = execute(statementsMatcher(),'select * from tbl1 ; select * from tbl2')

const firstStatement = result.capture['sql-statement-scope'][0]
if(firstStatement['sql-statement-select']){
    //最初のSQL文がSELECT文なら
}
```

---

#### `statement`

matcher     : `statementMatcher`

`statementMatcher`は**単一**の任意のSQLにマッチします。例えば1つのSELECT文にはマッチしますが、SELECT文とINSERT文にはマッチしません。

##### `statementMatcher` capture

`statementMatcher`を使用すると以下のようにキャプチャします。

```typescript
output.capture = {
    [statementsKey.scope]:[
        //該当SQLのキャプチャ内容
        {
            [statementsKey.statement] : [/* マッチしたSQLのトークン列 */],
            [statementsKey.xxx] : [/* マッチしたSQL(xxx文)のトークン列(sql-statement) */],
            //SQL文のキャプチャ内容...
        }
    ]
}
```

以下が実行例です

```typescript
const result = execute(statementMatcher(), 'select * from tbl1')
result.capture = {
    'sql-statement-scope': [
      {
            'sql-statement-select': [ [ 'select', '*', 'from', 'tbl1' ] ],
            'sql-statement': [ [ 'select', '*', 'from', 'tbl1' ] ]
            'select-select': [ [ '*' ] ],
            'select-from': [ [ 'tbl1' ] ],
            column: [ [ '*' ] ],
      }
    ]
}
```

- statementsMatcherは内部でこのstatementMatcherを使用しているためキャプチャ内容がとても似ています。

---

#### `select`

matcher     : `selectMatcher`
key         : `selectKey`

SQLにおけるSELECT文はデータベースからデータを抽出する際に使用します。

よって`selectMatcher`は、**どの値**を**どのように加工して**取得するかをキャプチャします。
より具体的には以下の句に指定された値を取得します。

- SELECT 句
- FROM 句
- WHERE 句
- GROUP BY 句
- ORDER BY 句
- LIMIT 句
- OFFSET 句

##### `selectMatcher` capture

`selectMatcher`を使用すると以下のようにキャプチャします。

```typescript
output.capture = {
    [selectKey.select]     : [/* SELECT句で指定された列などのトークン列 */],
    [selectKey.from]       : [/* FROM句で指定された列などの表名 */],
    'where-condition'      : [/* WHERE句で指定された条件 */],
    [selectKey.groupBy]    : [/* GROUP BY句で指定された列のトークン列 */],
    [selectKey.orderBy]    : [/* ORDER BY句で指定された列と並び順(ASC または DESC)のトークン列 */],
    [selectKey.limit]      : [/* LIMIT句で指定された行数(整数) */],
    [selectKey.offset]     : [/* OFFSET句で指定された行数(整数) */],
}
```

以下が実行例です

```typescript
//実行例1
const result = execute(selectMatcher(), 'select * from tbl1')
result.capture = {
    'select-select': [ [ '*' ] ],
    'select-from': [ [ 'tbl1' ] ],
    'column': [ [ '*' ] ],
}

//実行例2
const result = execute(selectMatcher(), "select * from tbl1 where id = 1 and name = 'tbsten'")
result.capture = {
    'select-select': [ [ '*' ] ],
    'select-from': [ [ 'tbl1' ] ],
    'where-condition': [ [ 'id', '=', '1' ], [ 'name', '=', "'tbsten'" ] ],
    'column': [ [ '*' ] ],
}
```

- (実行例1) WHERE句のキャプチャ名が不規則なのは他の文(DELETE,UPDATE)で使用する可能性があるため、
    `select-where`とすると他の文で紛らわしい名前になってしまうためです。

- (実行例2) またWHERE句のキャプチャについては現在開発段階です。今後大幅にキャプチャ構造が変わる可能性があります。

#### `insert`

matcher     : `insertMatcher`
key         : `insertKey`

INSERT文はデータベースにデータを追加するために使用します。

insertMatcherでは**どの表**に(または**どの表のどの列**に)、**どんなデータ**を追加するのかをキャプチャします。
追加するデータは次の2種類から選べます。

- **VALUES句を使ってデータを羅列**する方法
- **SELECT文で取得した結果**を追加する方法

##### `insertMatcher` capture

`insertMatcher`を使用すると以下のようにキャプチャします。

```typescript
result.capture = {
    [insertKey.table]           : [ /* 挿入するテーブル名のトークン列 */ ],
    [insertKey.column]          : [ /* 挿入する列名のトークン列 */ ],
    [insertKey.values.scope]    : [
        //1件目のデータ
        { [insertKey.value]     : [ /* 挿入するデータのトークン列 */ ] },
        //2件目のデータ
        { [insertKey.value]     : [ /* 挿入するデータのトークン列 */ ] },
        //3件目以降のデータ...
    ],
    [insertKey.select]:{
        //SELECT文のキャプチャ内容...
    }
}
```

以下が実行例です

```typescript
const result = execute(insertMatcher(), 'insert into tbl(a,b,c) values (1,2,3), (4,5,6)')
result.capture = {
    'insert-tbl': [ [ 'tbl' ] ],
    'insert-col': [ [ 'a' ], [ 'b' ], [ 'c' ] ],
    'insert-values': [
        { 'insert-values-value': [ [ '1' ], [ '2' ], [ '3' ] ] },
        { 'insert-values-value': [ [ '4' ], [ '5' ], [ '6' ] ] },
    ],
}
```

---

#### `update`

matcher     : `updateMatcher`
key         : `updateKey`

UPDATE文はデータベース内のデータを変更するために使用されます。

`updateMatcher`は**どのテーブル**の**どのデータ**を**どのように変更するのか**をキャプチャします。

##### `updateMatcher` capture

`updateMatcher`を使用すると以下のようにキャプチャします。

```typescript
result.capture = {
    [updateKey.update]  : [ /* UPDATE句で指定されたテーブル名のトークン列 */ ],
    [updateKey.set]     : [ /* SET句で指定された列と変更データのトークン列 */ ],
    'where-condition'   : [ /* WHERE句で指定された条件のトークン列 */ ]
}
```

以下が実行例です

```typescript
const result = execute(updateMatcher(), "update tbl set name = 'tbsten' where id = 3")
result.capture = {
    'update-update': [ [ 'tbl' ] ],
    'update-set': [ [ 'name', '=', "'tbsten'" ] ],
    'where-condition': [ [ 'id', '=', '3' ] ]
    column: [ [ 'id' ] ],
}
```

- [selectMatcher](#selectmatcher-capture)でも述べたとおり、開発中のWHERE句のキャプチャについては現在開発段階です。今後大幅にキャプチャ構造が変わる可能性があります。

---

#### `delete`

matcher     : `deleteMatcher`
key         : `deleteKey`

DELETE文はデータベース内のデータを削除するために使用されます。

`deleteMatcher`では**どのテーブル**から**どのデータ**を削除するかをキャプチャします。

##### `deleteMatcher` capture

`deleteMatcher`を使用すると以下のようにキャプチャします。

```typescript
result.capture = {
    [deleteKey.from]    : [ /* 指定されたテーブル名のトークン列 */ ],
    'where-condition'   : [ /* 指定された条件のトークン列 */ ],
}
```

以下が実行例です

```typescript
const result = execute(deleteMatcher(), "delete from tbl where id = 1")
result.capture = {
    'delete-from': [ [ 'tbl' ] ],
    'where-condition': [ [ 'id', '=', '1' ] ],
    'column': [ [ 'id' ] ],
}
```

- [selectMatcher](#selectmatcher-capture)でも述べたとおり、開発中のWHERE句のキャプチャについては現在開発段階です。今後大幅にキャプチャ構造が変わる可能性があります。

---

#### `createTable`

matcher     : `createTableMatcher`
key         : `createTableKey`

CREATE TABLE文はデータベースに表を作成するために使用する文です。

テーブルの名前、列の名前、列の型や制約などを定義します。`createTableMatcher`はこれらをキャプチャします。

使用できる型は以下の通りです。(これらはSQLite3を参考に実装されています)

- 整数型 ･･･ `INT` , `INTEGER` , `TINYINT` , `SMALLINT , MEDIUMINT` , `BIGINT` , `UNSIGNED BIG INT` , `INT2` , `INT8`
- 実数型 ･･･ `REAL` , `DOUBLE` , `DOUBLE PRECISION` , `FLOAT`
- 数値型 ･･･ `NUMERIC` , `DECIMAL(精度,桁数)` , `BOOLEAN` , `DATE` , `DATETIME`
- 文字列型 ･･･ `CHARACTER(size)` , `VARCHAR(size)` , `VARING CHARACTER(size)` , `NCHAR(size)` , `NATIVE CHARACTER` , `NVARCHAR(size)` , `TEXT` , `CLOB`
- バイナリ型 ･･･ `BLOB`

また、使用できる制約は以下の通りです。

| 制約                          | 列レベル制約 | 表レベル制約 |
| ----------------------------- | ------------ | ------------ |
| `PRIMARY KEY`                 | ✅            | ✅            |
| `NOT NULL`                    | ✅            | ❌            |
| `UNIQUE`                      | ✅            | ✅            |
| `CHECK(条件)`                 | ✅            | ✅            |
| `DEFAULT デフォルト値`        | ✅            | ❌            |
| `REFERENCES テーブル名(列名)` | ✅            | ✅            |

##### `createTableMatcher` capture

`createTableMatcher`を使用すると以下のようにキャプチャします。

```typescript
result.capture = {
    [createTableKey.table]      : [ /* 定義する表の名前のトークン列 */ ],
    [createTableKey.column]     : [ /* 定義する列の名前のトークン列 */ ],
    [createTableKey.def.column] : [ /* 列の定義のトークン列 */ ],
    [createTableKey.def.table]  : [ /* 表レベル制約の定義のトークン列 */ ],
}
```

以下が実行例です

```typescript
const result = execute(createTableMatcher(), "create table tbl( id integer primary key, name text )")
result.capture = {
    'create-table-table': [ [ 'tbl' ] ],
    'create-table-col': [ [ 'id' ], [ 'name' ] ],
    'create-table-col-def': [ [ 'id', 'integer', 'primary', 'key' ], [ 'name', 'text' ] ]
}
```

- WHERE句と同様にCREATE TABLEの列の定義についても現在開発中で今後大幅に変更される予定です。

---

#### `alter table`

matcher     : `alterTableMatcher`
key         : `alterTableKey`

ALTER TABLE文はテーブルの定義情報(例えば列名や列の型など)を変更するために用います。

##### `alterTableMatcher` capture

`alterTableMatcher`を使用すると以下のようにキャプチャします。

```typescript
result.capture = {
    [alterTableKey.table]                   : [ /* 変更するテーブル名のトークン列 */ ],
    //rename table
    [alterTableKey.rename.table]            :[ /* 変更後のテーブル名のトークン列 */ ],
    //rename column
    [alterTableKey.rename.column.before]    :[ /* 変更する列名のトークン列 */ ],
    [alterTableKey.rename.column.after]     :[ /* 変更後の列名のトークン列 */ ],
    //add column
    [alterTableKey.add.column.name]         : [ /* 追加する列名のトークン列 */ ],
    [alterTableKey.add.column.def]          : [ /* 追加する列の定義のトークン列 */ ],
    //drop column
    [alterTableKey.drop.column]             :[ /* 削除する列のトークン列 */ ],
}
```

以下が実行例です

```typescript
const result = execute(alterTableMatcher(), "alter table tbl add column col integer not null")
result.capture = {
    'alter-table-table': [ [ 'tbl' ] ],
    'alter-table-add-column': [ [ 'col' ] ],
    'alter-table-add-column-def': [ [ 'col', 'integer', 'not', 'null' ] ]
}
```

---

#### `drop table`

matcher     : `dropTableMatcher`
key         : `dropTableKey`

DROP TABLE文は定義されているテーブルを削除するために使用します。

##### `dropTableMatcher` capture

`alterTableMatcher`を使用すると以下のようにキャプチャします。

```typescript
result.capture = {
    [dropTableKey.table]    : [ /* 削除する表名のトークン列 */ ] ,
}
```

以下が実行例です

```typescript
const result = execute(statementMatcher(),"select * from tbl1")
result.capture = {
    'drop-table-table': [ [ 'tbl' ] ] ,
}
```

---
