## Exercício – Melhorando a Pokédex!

### Objetivo Geral

A partir do código base da Pokédex implementado em aula, você deverá realizar melhorias funcionais e visuais que envolvem o uso de props, useState, useEffect, estilização separada e organização de componentes.

---

#### Tarefas obrigatórias

Refatore o componente principal (Pokedex.tsx) para que ele utilize um componente PokeCard. Este novo componente deverá receber os dados do Pokémon via props e exibi-los com base no que já foi implementado (nome, altura, peso, tipos e imagem).

- Adicione a funcionalidade de “favoritar” um Pokémon:
  - Crie um botão no PokeCard que permita marcar ou desmarcar um Pokémon como favorito.
  - Use o useState dentro do PokeCard para armazenar esse estado.
  - Exiba um ⭐ ao lado do nome se o Pokémon estiver marcado como favorito.

- Estilize a aplicação utilizando o arquivo Pokedex.css e crie um novo PokeCard.css:
  - Separe as responsabilidades visuais entre os arquivos CSS de Pokedex e PokeCard.
  - Melhore o layout centralizando a tela, ajustando cores e tornando os elementos visualmente mais amigáveis.

- Utilize o useEffect para exibir uma mensagem no console toda vez que um novo Pokémon for carregado:
  - Exemplo de mensagem: "Pokémon Bulbasaur carregado com sucesso!".

**Dicas**

- Crie o PokeCard.tsx em src/components.
- No useEffect, adicione pokemon como dependência para escutar mudanças nos dados.
- Lembre-se de que props são apenas leitura. O estado de favorito deve ser local ao PokeCard.
- Mantenha a legibilidade do código: separe lógica, apresentação e estilo de forma limpa.

---

#### Critérios de avaliação

Critério Peso:

- Uso correto de props e PokeCard 3.0
- Implementação da lógica de favorito 2.0
- Uso de useEffect para log de evento 2.0
- Organização do CSS em arquivos separados 1.5
- Organização geral e clareza do código 1.5

**Desafio (extra)**

- Permita buscar vários Pokémons em sequência e mostre todos abaixo, em cards separados.
- Armazene os favoritos em localStorage usando useEffect.(ou seja quando recarregar a pagina os favoritos ainda vao estar marcado como favoritos)
