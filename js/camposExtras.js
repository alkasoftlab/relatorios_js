/* =========================================================
   Campos extras: ajustes antes do PUT de um registro
   ---------------------------------------------------------
   O PUT regrava todos os valores de campos extras do registro e o backend
   valida cada um. Valores antigos (migração, gravações anteriores à
   validação) podem voltar no GET num formato que o próprio backend recusa,
   e o registro inteiro deixa de ser gravado. O Eleven corrige alguns desses
   casos ao abrir a edição; aqui é feito o mesmo para as telas que gravam
   registros em lote.
   ========================================================= */

const CamposExtras = (() => {
  // campos de cada cadastro já carregados: { TIPO: Promise<[{ id, nome, tipo:{ valor } }]> }
  const cache = {};

  async function carregar(appUrl, tipoCadastro, headers){
    const r = await fetch(`${appUrl}/tiposdocadastro/${tipoCadastro}/camposextras`, { headers });
    if(!r.ok){
      throw new Error(`ao carregar os campos extras do cadastro (código ${r.status})`);
    }
    const lista = await r.json().catch(() => null);
    return Array.isArray(lista) ? lista : [];
  }

  // Campos extras do cadastro, buscados uma vez por tela; uma falha não fica
  // em cache, para a próxima chamada tentar de novo.
  function camposDoCadastro(appUrl, tipoCadastro, headers){
    if(!cache[tipoCadastro]){
      cache[tipoCadastro] = carregar(appUrl, tipoCadastro, headers).catch(err => {
        delete cache[tipoCadastro];
        throw err;
      });
    }
    return cache[tipoCadastro];
  }

  // Decimal: o backend exige exatamente duas casas, mas há valores gravados
  // sem elas ("5035"). O Eleven completa ao abrir a edição ("5035.00"); aqui
  // é feito o mesmo, no texto, sem converter para número. Mais de duas casas
  // fica como está.
  function completarCasasDecimais(obj, campos){
    if(!Array.isArray(obj?.valoresCamposExtras)){
      return;
    }
    const decimais = new Set(campos.filter(c => c.tipo?.valor === 'DECIMAL').map(c => String(c.id)));
    for(const v of obj.valoresCamposExtras){
      if(!decimais.has(String(v.idCampoExtra)) || typeof v.valor !== 'string'){
        continue;
      }
      const partes = v.valor.match(/^(-?\d+)(?:\.(\d?))?$/);
      if(partes){
        v.valor = `${partes[1]}.${(partes[2] || '').padEnd(2, '0')}`;
      }
    }
  }

  // Ajusta os valores do registro antes do PUT, carregando os campos do cadastro se preciso.
  async function prepararParaPut(obj, appUrl, tipoCadastro, headers){
    if(!obj?.valoresCamposExtras?.length){
      return obj;
    }
    completarCasasDecimais(obj, await camposDoCadastro(appUrl, tipoCadastro, headers));
    return obj;
  }

  return { camposDoCadastro, completarCasasDecimais, prepararParaPut };
})();
