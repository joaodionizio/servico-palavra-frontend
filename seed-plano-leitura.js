import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const confirmacaoSeed = process.env.CONFIRM_SEED_PLANO_LEITURA;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Erro: configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
  process.exit(1);
}

if (confirmacaoSeed !== 'SIM_APAGAR_E_RECRIAR_PLANO') {
  console.error(
    'Erro: defina CONFIRM_SEED_PLANO_LEITURA=SIM_APAGAR_E_RECRIAR_PLANO para confirmar a limpeza da tabela.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const leituras = [
  ["1 João 1", "1 João 2", "1 João 3", "1 João 4", "1 João 5", "João 1", "João 2", "João 3", "João 4", "João 5", "João 6", "João 7", "João 8", "João 9", "João 10", "João 11", "João 12", "João 13", "João 14", "João 15", "João 16", "João 17", "João 18", "João 19", "João 20", "João 21", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre"],
  ["1 João 1", "1 João 2", "1 João 3", "1 João 4", "1 João 5", "Marcos 1", "Marcos 2", "Marcos 3", "Marcos 4", "Marcos 5", "Marcos 6", "Marcos 7", "Marcos 8", "Marcos 9", "Marcos 10", "Marcos 11", "Marcos 12", "Marcos 13", "Marcos 14", "Marcos 15", "Marcos 16", "Gálatas 1", "Gálatas 2", "Gálatas 3", "Gálatas 4", "Gálatas 5", "Gálatas 6", "Meditação livre", "Meditação livre", "Meditação livre"],
  ["Efésios 1", "Efésios 2", "Efésios 3", "Efésios 4", "Efésios 5", "Efésios 6", "Filipenses 1", "Filipenses 2", "Filipenses 3", "Filipenses 4", "Colossenses 1", "Colossenses 2", "Colossenses 3", "Colossenses 4", "1 Tessalonicenses 1", "1 Tessalonicenses 2", "1 Tessalonicenses 3", "1 Tessalonicenses 4", "1 Tessalonicenses 5", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre"],
  ["2 Tessalonicenses 1", "2 Tessalonicenses 2", "2 Tessalonicenses 3", "1 Timóteo 1", "1 Timóteo 2", "1 Timóteo 3", "1 Timóteo 4", "1 Timóteo 5", "1 Timóteo 6", "2 Timóteo 1", "2 Timóteo 2", "2 Timóteo 3", "2 Timóteo 4", "Tito 1", "Tito 2", "Tito 3", "Filemon 1", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre"],
  ["Lucas 1, 2", "Lucas 3, 4", "Lucas 5, 6", "Lucas 7, 8", "Lucas 9, 10", "Lucas 11, 12", "Lucas 13, 14", "Lucas 15, 16", "Lucas 17", "Lucas 18", "Lucas 19", "Lucas 20", "Lucas 21", "Lucas 22", "Lucas 23", "Lucas 24", "Atos 1", "Atos 2", "Atos 3", "Atos 4", "Atos 5", "Atos 6", "Atos 7", "Atos 8", "Atos 9", "Atos 10", "Atos 11", "Atos 12", "Atos 13", "Atos 14"],
  ["Atos 15", "Atos 16", "Atos 17", "Atos 18", "Atos 19", "Atos 20", "Atos 21", "Atos 22", "Atos 23", "Atos 24", "Atos 25", "Atos 26", "Atos 27", "Atos 28", "Romanos 1", "Romanos 2", "Romanos 3", "Romanos 4", "Romanos 5", "Romanos 6", "Romanos 7", "Romanos 8", "Romanos 9", "Romanos 10", "Romanos 11", "Romanos 12", "Romanos 13", "Romanos 14", "Romanos 15", "Romanos 16"],
  ["Mateus 1, 2", "Mateus 3, 4", "Mateus 5, 6", "Mateus 7, 8", "Mateus 9, 10", "Mateus 11, 12", "Mateus 13, 14", "Mateus 15, 16", "Mateus 17, 18", "Mateus 19, 20", "Mateus 21, 22", "Mateus 23, 24", "Mateus 25, 26", "Mateus 27, 28", "1 Coríntios 1", "1 Coríntios 2", "1 Coríntios 3", "1 Coríntios 4", "1 Coríntios 5", "1 Coríntios 6", "1 Coríntios 7", "1 Coríntios 8", "1 Coríntios 9", "1 Coríntios 10", "1 Coríntios 11", "1 Coríntios 12", "1 Coríntios 13", "1 Coríntios 14", "1 Coríntios 15", "1 Coríntios 16"],
  ["2 Coríntios 1, 2", "2 Coríntios 3", "2 Coríntios 4", "2 Coríntios 5", "2 Coríntios 6", "2 Coríntios 7", "2 Coríntios 8", "2 Coríntios 9", "2 Coríntios 10", "2 Coríntios 11", "2 Coríntios 12", "2 Coríntios 13", "Hebreus 1", "Hebreus 2", "Hebreus 3", "Hebreus 4", "Hebreus 5", "Hebreus 6", "Hebreus 7", "Hebreus 8", "Hebreus 9", "Hebreus 10", "Hebreus 11", "Hebreus 12", "Hebreus 13", "Tiago 1", "Tiago 2", "Tiago 3", "Tiago 4", "Tiago 5"],
  ["1 Pedro 1, 2", "1 Pedro 3, 4", "1 Pedro 5, 2 Pe 1", "2 Pedro 2, 3", "1 João 1", "2 João 1", "3 João 1", "Judas 1", "Apocalipse 1", "Apocalipse 2", "Apocalipse 3", "Apocalipse 4", "Apocalipse 5", "Apocalipse 6", "Apocalipse 7", "Apocalipse 8", "Apocalipse 9", "Apocalipse 10", "Apocalipse 11", "Apocalipse 12", "Apocalipse 13", "Apocalipse 14", "Apocalipse 15", "Apocalipse 16", "Apocalipse 17", "Apocalipse 18", "Apocalipse 19", "Apocalipse 20", "Apocalipse 21", "Apocalipse 22"],
  ["1 João 1", "1 João 2", "1 João 3", "1 João 4", "1 João 5", "João 1", "João 2", "João 3", "João 4", "João 5", "João 6", "João 7", "João 8", "João 9", "João 10", "João 11", "João 12", "João 13", "João 14", "João 15", "João 16", "João 17", "João 18", "João 19", "João 20", "João 21", "Meditação livre", "Meditação livre", "Meditação livre", "Meditação livre"],
  ["Gênesis 1-3", "Gênesis 4-6", "Gênesis 7-9", "Gênesis 10-12", "Gênesis 13-15", "Gênesis 16-18", "Gênesis 19-21", "Gênesis 22-24", "Gênesis 25-27", "Gênesis 28-30", "Gênesis 31, 32", "Gênesis 33, 34", "Gênesis 35, 36", "Gênesis 37, 38", "Gênesis 39, 40", "Gênesis 41, 42", "Gênesis 43, 44", "Gênesis 45, 46", "Gênesis 47, 48", "Gênesis 49, 50", "Êxodo 1, 2", "Êxodo 3, 4", "Êxodo 5, 6", "Êxodo 7, 8", "Êxodo 9, 10", "Êxodo 11, 12", "Êxodo 13, 14", "Êxodo 15, 16", "Êxodo 17, 18", "Êxodo 19, 20"],
  ["Êxodo 21, 22", "Êxodo 23, 24", "Êxodo 25, 26", "Êxodo 27, 28", "Êxodo 29, 30", "Êxodo 31, 32", "Êxodo 33, 34", "Êxodo 35, 36", "Êxodo 37, 38", "Êxodo 39, 40", "Números 1, 2", "Números 3, 4", "Números 5, 6", "Números 7, 8", "Números 9, 10", "Números 11, 12", "Números 13, 14", "Números 15, 16", "Números 17, 18", "Números 19, 20", "Números 21, 22", "Números 23, 24", "Números 25, 26", "Números 27, 28", "Números 29, 30", "Números 31, 32", "Números 33", "Números 34", "Números 35", "Números 36"],
  ["Josué 1, 2", "Josué 3, 4", "Josué 5, 6", "Josué 7, 8", "Josué 9, 10", "Josué 11, 12", "Josué 13, 14", "Josué 15, 16", "Josué 17, 18", "Josué 19, 20", "Josué 21, 22", "Josué 23, 24", "Juízes 1, 2", "Juízes 3, 4", "Juízes 5, 6", "Juízes 7, 8", "Juízes 9, 10", "Juízes 11, 12", "Juízes 13, 14", "Juízes 15", "Juízes 16", "Juízes 17", "Juízes 18", "Juízes 19", "Juízes 20", "Juízes 21", "Rute 1", "Rute 2", "Rute 3", "Rute 4"],
  ["1 Samuel 1, 2", "1 Samuel 3, 4", "1 Samuel 5, 6", "1 Samuel 7, 8", "1 Samuel 9, 10", "1 Samuel 11, 12", "1 Samuel 13, 14", "1 Samuel 15, 16", "1 Samuel 17, 18", "1 Samuel 19, 20", "1 Samuel 21, 22", "1 Samuel 23, 24", "1 Samuel 25, 26", "1 Samuel 27, 28", "1 Samuel 29, 30", "1 Sm 31, 2 Sm 1", "2 Samuel 2, 3", "2 Samuel 4, 5", "2 Samuel 6, 7", "2 Samuel 8, 9", "2 Samuel 10, 11", "2 Samuel 12, 13", "2 Samuel 14, 15", "2 Samuel 16, 17", "2 Samuel 18, 19", "2 Samuel 20", "2 Samuel 21", "2 Samuel 22", "2 Samuel 23", "2 Samuel 24"],
  ["1 Reis 1, 2", "1 Reis 3, 4", "1 Reis 5, 6", "1 Reis 7, 8", "1 Reis 9, 10", "1 Reis 11, 12", "1 Reis 13, 14", "1 Reis 15, 16", "1 Reis 17, 18", "1 Reis 19, 20", "1 Reis 21, 22", "2 Reis 1, 2", "2 Reis 3, 4", "2 Reis 5, 6", "2 Reis 7, 8", "2 Reis 9, 10", "2 Reis 11, 12", "2 Reis 13", "2 Reis 14", "2 Reis 15", "2 Reis 16", "2 Reis 17", "2 Reis 18", "2 Reis 19", "2 Reis 20", "2 Reis 21", "2 Reis 22", "2 Reis 23", "2 Reis 24", "2 Reis 25"],
  ["Amós 1-3", "Amós 4-6", "Amós 7, 8", "Amós 9, Oseias 1", "Oseias 2, 3", "Oseias 4, 5", "Oseias 6, 7", "Oseias 8, 9", "Oseias 10, 11", "Oseias 12, 13", "Oseias 14, Isaías 1", "Isaías 2, 3", "Isaías 4, 5", "Isaías 6, 7", "Isaías 8, 9", "Isaías 10, 11", "Isaías 12, 13", "Isaías 14, 15", "Isaías 16, 17", "Isaías 18, 19", "Isaías 20, 21", "Isaías 22, 23", "Isaías 24, 25", "Isaías 26, 27", "Isaías 28, 29", "Isaías 30, 31", "Isaías 32, 33", "Isaías 34, 35", "Isaías 36, 37", "Isaías 38, 39"],
  ["Miqueias 1-3", "Miqueias 4-6", "Miqueias 7, Naum 1-2", "Naum 3, Hab 1-2", "Hab 3, Jer 1-2", "Jeremias 3-5", "Jeremias 6-8", "Jeremias 9-11", "Jeremias 12-14", "Jeremias 15-17", "Jeremias 18, 19", "Jeremias 20, 21", "Jeremias 22, 23", "Jeremias 24, 25", "Jeremias 26, 27", "Jeremias 28, 29", "Jeremias 30, 31", "Jeremias 32, 33", "Jeremias 34, 35", "Jeremias 36, 37", "Jeremias 38, 39", "Jeremias 40, 41", "Jeremias 42, 43", "Jeremias 44, 45", "Jeremias 46, 47", "Jeremias 48, 49", "Jeremias 50, 51", "Jeremias 52, Lam 1", "Lamentações 2, 3", "Lamentações 4, 5"],
  ["Ezequiel 1-3", "Ezequiel 4, 5", "Ezequiel 6, 7", "Ezequiel 8, 9", "Ezequiel 10, 11", "Ezequiel 12, 13", "Ezequiel 14, 15", "Ezequiel 16, 17", "Ezequiel 18, 19", "Ezequiel 20, 21", "Ezequiel 22, 23", "Ezequiel 24, 25", "Ezequiel 26, 27", "Ezequiel 28, 29", "Ezequiel 30, 31", "Ezequiel 32, 33", "Ezequiel 34, 35", "Ezequiel 36, 37", "Ezequiel 38, 39", "Ezequiel 40, 41", "Ezequiel 42, 43", "Ezequiel 44, 45", "Ezequiel 46, 47", "Ezequiel 48, Abdias 1", "Isaías 44, 45", "Isaías 46, 47", "Isaías 48, 49", "Isaías 50, 51", "Isaías 52, 53", "Isaías 54, 55"],
  ["1 Crônicas 1-3", "1 Crônicas 4-6", "1 Crônicas 7-9", "1 Crônicas 10-12", "1 Crônicas 13-15", "1 Crônicas 16-18", "1 Crônicas 19-21", "1 Crônicas 22-24", "1 Crônicas 25-27", "1 Crôn 28-29, 2 Crôn 1", "2 Crônicas 2-4", "2 Crônicas 5-7", "2 Crônicas 8-10", "2 Crônicas 11-13", "2 Crônicas 14-16", "2 Crônicas 17-19", "2 Crônicas 20-22", "2 Crônicas 23-25", "2 Crônicas 26-28", "2 Crônicas 29-31", "2 Crônicas 32-34", "2 Crôn 35-36, Esdras 1", "Esdras 2-4", "Esdras 5-7", "Esdras 8-10", "Neemias 1-3", "Neemias 4-6", "Neemias 7-9", "Neemias 10, 11", "Neemias 12, 13"],
  ["Ageu 1-2, Zac 1-7", "Zac 8-14, Mal 1-2", "Mal 3-4, Joel 1-3, Jon 1-4", "Tobias 1-9", "Tobias 10-14, Jud 1-4", "Judite 5-13", "Jud 14-16, Est 1-6", "Ester 7-10, Jó 1-5", "Jó 6-14 (exceto 10)", "Jó 15-23 (exceto 18)", "Jó 24-32", "Jó 33-41", "Jó 42, Eclesiastes 1-7", "Ecl 8-12, 1 Mac 1-3", "1 Macabeus 4-11", "1 Mac 12-16, 2 Mac 1-3", "2 Macabeus 4-11", "2 Mac 12-15, Baruc 1-4", "Baruc 5-6, Daniel 1-6", "Daniel 7-14", "Sabedoria 1-8", "Sabedoria 9-16", "Sab 17-19, Levítico 1-5", "Levítico 6-13", "Levítico 14-21", "Lev 22-27, Deut 1-2", "Deuteronômio 3-10", "Deuteronômio 11-18", "Deuteronômio 19-26", "Deuteronômio 27-34"]
];

function gerarDiasDoPlano() {
  return leituras.flatMap((leiturasDoMes, indiceMes) => {
    const mesNumero = indiceMes + 1;

    return leiturasDoMes.map((leitura, indiceDia) => {
      const diaNumero = indiceDia + 1;
      const salmoNumero = ((indiceMes % 5) * 30) + diaNumero;

      return {
        mes_numero: mesNumero,
        dia_numero: diaNumero,
        leitura_texto: leitura,
        salmo_numero: salmoNumero
      };
    });
  });
}

async function limparTabela() {
  const { error } = await supabase
    .from('plano_leitura_dias')
    .delete()
    .gte('id', 1);

  if (error) {
    throw new Error(`Erro ao limpar tabela: ${error.message}`);
  }
}

async function inserirPlano() {
  const dias = gerarDiasDoPlano();

  if (dias.length !== 600) {
    throw new Error(`Erro: o plano deveria ter 600 dias, mas gerou ${dias.length}`);
  }

  console.log(`Inserindo ${dias.length} dias no Supabase...`);

  const { error } = await supabase
    .from('plano_leitura_dias')
    .insert(dias);

  if (error) {
    throw new Error(`Erro ao inserir plano: ${error.message}`);
  }

  console.log('Plano de leitura inserido com sucesso!');
}

async function main() {
  try {
    console.log('Iniciando carga do plano de leitura...');

    await limparTabela();
    await inserirPlano();

    console.log('Finalizado.');
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
