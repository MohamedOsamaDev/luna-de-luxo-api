import {
  ClothesModel,
  DecorModel,
} from "../../../database/models/product.model.js";
// utility functions
const formateItem = (item) => {
  // get product details
  let color = {
    original_id: item.color?._id,
    name: item.color?.name,
    code: item.color?.code,
  };
  let size = {
    original_id: item.size?._id,
    name: item.size?.name,
  };
  let selectedOptions =
    {
      clothes: {
        color,
        size,
      },
      decor: {
        color,
      },
    }[item.product?.type] || {};    
  return {
    original_id: item.product?._id,
    name: item.product?.name,
    price: item.product?.price,
    discount: item.product?.discount,
    quantity: item.quantity,
    poster: item.product?.poster?.url,
    type: item.product?.type,
    selectedOptions,
    id: item?._id,
  };
};
// --------------------------------- start prepare product for make order  ---------------------------------
// clothes case
export const clothesPrepareForMakeOrder = ({
  product,
  color,
  size,
  quantity,
  bulkOperations,
  items,
  _id
}) => {
  const colorMatch = product?.colors?.find((c) =>
    c?.color?._id.equals(color?._id)
  );

  const sizeMatch = colorMatch?.sizes?.find((s) =>
    s?.size?._id.equals(size?._id)
  );

  if (
    !product?._id ||
    !colorMatch ||
    !sizeMatch ||
    sizeMatch?.stock < quantity
  ) {
    return false;
  }

  // Add formatted order item to list
  items.push(
    formateItem({
      product,
      color,
      size,
      quantity,
      id:_id
    })
  );
  let task = {
    updateOne: {
      filter: {
        _id: product?._id,
        "colors.color": color?._id,
        "colors.sizes.size": size?._id,
      },
      update: {
        $inc: {
          "colors.$[colorElem].sizes.$[sizeElem].stock": -quantity,
        },
      },
      arrayFilters: [
        { "colorElem.color": color?._id },
        { "sizeElem.size": size?._id },
      ],
    },
  };
  if (bulkOperations?.clothes) {
    bulkOperations.clothes.tasks.push(task);
  } else {
    bulkOperations.clothes = {
      model: ClothesModel,
      tasks: [task],
    };
  }
  return true;
};
// decor case
export const decorPrepareForMakeOrder = (item) => {
  const { product,_id ,color, quantity, bulkOperations, items } = item;

  const colorMatch = product?.colors?.find((c) =>
    c?.color?._id.equals(color?._id)
  );
  if (!product?._id || !colorMatch || colorMatch?.stock < quantity) {
    return false;
  }
  // Add formatted order item to list
  items.push(
    formateItem({
      product,
      color,
      quantity,
      id:_id
    })
  );

  let task = {
    updateOne: {
      filter: {
        _id: product?._id,
        "colors.color": color?._id,
      },
      update: {
        $inc: {
          "colors.$[colorElem].stock": -quantity,
        },
      },
      arrayFilters: [{ "colorElem.color": color?._id }],
    },
  };
  if (bulkOperations?.decor) {
    bulkOperations.decor.tasks.push(task);
  } else {
    bulkOperations.decor = {
      model: DecorModel,
      tasks: [task],
    };
  }
  return true;
};
// ---------------------------------                End                --------------------------------------
// --------------------------------- start restock in cases ( for handle if order is cancled)  --------------
// clothes case
export const clothesPrepareReStock = (item, bulkOperations) => {
  const { original_id, selectedOptions } = item;
  const { color, size } = selectedOptions;

  const task = {
    updateOne: {
      filter: {
        _id: original_id,
        "colors.color": color?.original_id,
        "colors.sizes.size": size?.original_id,
      },
      update: {
        $inc: {
          "colors.$[colorElem].sizes.$[sizeElem].stock": item.quantity,
        },
      },
      arrayFilters: [
        {
          "colorElem.color": color?.original_id,
        },
        {
          "sizeElem.size": size?.original_id,
        },
      ],
    },
  };

  if (bulkOperations?.clothes) {
    bulkOperations.clothes.tasks.push(task);
  } else {
    bulkOperations.clothes = {
      model: ClothesModel,
      tasks: [task],
    };
  }
  return true;
};
// decor case
export const decorPrepareReStock = (item, bulkOperations) => {
  const { original_id, selectedOptions } = item;
  const { color } = selectedOptions;
  const task = {
    updateOne: {
      filter: { _id: original_id },
      update: {
        $inc: {
          "colors.$[colorElem].stock": item.quantity,
        },
      },
      arrayFilters: [
        {
          "colorElem.color": color?.original_id,
        },
      ],
    },
  };
  if (bulkOperations?.decor) {
    bulkOperations.decor.tasks.push(task);
  } else {
    bulkOperations.decor = {
      model: DecorModel,
      tasks: [task],
    };
  }
  return true;
};
// ---------------------------------                End                --------------------------------------
