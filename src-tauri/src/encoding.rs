#[derive(PartialEq)]
pub enum BOM {
    BigEndian,
    LittleEndian,
    None
}

pub fn convert_to_u16(str: &str, bom: BOM) -> Vec<u8> {
    let mut bytes = vec![];

        if bom == BOM::BigEndian {
            bytes = core::iter::once(0xFEFF)
                .chain(str.encode_utf16())
                .flat_map(|word| word.to_be_bytes())
                .collect::<Vec<_>>();
        } 
        else if bom == BOM::LittleEndian {
            bytes = core::iter::once(0xFFFE)
                .chain(str.encode_utf16())
                .flat_map(|word| word.to_le_bytes())
                .collect::<Vec<_>>();
        }
        else if bom == BOM::None {
            bytes = str.encode_utf16()
                .flat_map(|word| word.to_be_bytes())
                .collect::<Vec<_>>();
        }
    bytes
}