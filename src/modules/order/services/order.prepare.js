import {
  ClothesModel,
  DecorModel,
} from "../../../database/models/product.model.js";
// --------------------------------- prepare product for make order  ---------------------------------
// clothes case
export const clothesPrepareForMakeOrder = ({
  product,
  color,
  size,
  quantity,
  bulkOperations,
  items,
}) => {
  const colorMatch = product?.colors?.find((c) =>
    c?.color?._id.equals(color?._id)
  );

  const sizeMatch = colorMatch?.sizes?.find((s) =>
    s?.size?._id.equals(size?._id)
  );

  if (!product._id || !colorMatch || !sizeMatch || sizeMatch.stock < quantity)
    return false;

  // Add formatted order item to list
  items.push({
    original_id: product?._id,
    name: product?.name,
    price: product?.price,
    discount: product?.discount,
    quantity: quantity,
    poster: product?.poster?.url,
    type: product?.type,
    selectedOptions: {
      color: {
        original_id: colorMatch?.color?._id,
        name: colorMatch?.color?.name,
        code: colorMatch?.color?.code,
      },
      size: {
        original_id: sizeMatch?.size?._id,
        name: sizeMatch?.size?.name,
      },
    },
  });

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
export const decorPrepareForMakeOrder = ({
  product,
  color,
  quantity,
  bulkOperations,
  items,
}) => {
  const colorMatch = product?.colors?.find((c) =>
    c?.color?._id.equals(color?._id)
  );
  if (!product?._id || !colorMatch || colorMatch?.stock < quantity)
    return false;
  // Add formatted order item to list
  items.push({
    original_id: product?._id,
    name: product?.name,
    price: product?.price,
    discount: product?.discount,
    quantity,
    poster: product?.poster?.url,
    type: product?.type,
    selectedOptions: {
      color: {
        original_id: colorMatch?.color?._id,
        name: colorMatch?.color?.name,
        code: colorMatch?.color?.code,
      },
    },
  });

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
// --------------------------------- restock in case order is cancled  ---------------------------------
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
